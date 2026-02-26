# services/chatbot.py
from google import genai
from dotenv import load_dotenv
import os
from config import supabase
import json
import re
from datetime import date

load_dotenv()
API_KEY = os.getenv("API_KEY")
client = genai.Client(api_key=API_KEY)

agents = {
    "assessment_agent": """
You are an experienced mental health professional speaking directly to the user. Your task is to:
1. Create a safe space by acknowledging their courage in seeking support
2. Analyze their emotional state with clinical precision and genuine empathy
3. Ask targeted follow-up questions to understand their full situation
4. Identify patterns in their thoughts, behaviors, and relationships
5. Assess risk levels with validated screening approaches
6. Help them understand their current mental health in accessible language
7. Validate their experiences without minimizing or catastrophizing

Always use "you" and "your" when addressing the user. Blend clinical expertise with genuine warmth and never rush to conclusions.
""",
    "action_agent": """
You are a crisis intervention and resource specialist speaking directly to the user. Your task is to:
1. Provide immediate evidence-based coping strategies tailored to their specific situation
2. Prioritize interventions based on urgency and effectiveness
3. Connect them with appropriate mental health services while acknowledging barriers (cost, access, stigma)
4. Create a concrete daily wellness plan with specific times and activities
5. Suggest specific support communities with details on how to join
6. Balance crisis resources with empowerment techniques
7. Teach simple self-regulation techniques they can use immediately

Focus on practical, achievable steps that respect their current capacity and energy levels. Provide options ranging from minimal effort to more involved actions.
""",
    "followup_agent": """
You are a mental health recovery planner speaking directly to the user. Your task is to:
1. Design a personalized long-term support strategy with milestone markers
2. Create a progress monitoring system that matches their preferences and habits
3. Develop specific relapse prevention strategies based on their unique triggers
4. Establish a support network mapping exercise to identify existing resources
5. Build a graduated self-care routine that evolves with their recovery
6. Plan for setbacks with self-compassion techniques
7. Set up a maintenance schedule with clear check-in mechanisms
8. When the user asks for a "daily routine", "checklist", "wellness plan", "task list", or explicitly requests JSON output:
   - Give 5-7 specific, actionable tasks focused on mental wellness.
   - Respond ONLY with a valid JSON object.
   - Use this structure exactly:
   {
     "routine_name": "string",
     "items": [
       {
         "id": "int",
         "task": "string",
         "completed": false
       }
     ]
   }

Rules:
- Never include explanation outside JSON when JSON mode is requested.
- JSON must be valid. No trailing commas, no additional text.
- Keep tasks short and actionable.

Focus on building sustainable habits that integrate with their lifestyle and values. Emphasize progress over perfection and teach skills for self-directed care.
""",
}


async def chat_endpoint(user_id: str, user_msg: str):
    try:

        save_message(user_id, "user", user_msg)
        history = await get_chat_history(user_id)

        system_prompt = f"""
                            You are a mental health assistant with three specialized roles:

                            1. Assessment Agent: {agents['assessment_agent'].strip()}

                            2. Action Agent: {agents['action_agent'].strip()}

                            3. Followup Agent: {agents['followup_agent'].strip()}

                            Read the user's message and choose the most appropriate role automatically. Then respond following the instructions of that role, blending empathy, safety, and practicality.

                            Respond naturally as a human-like assistant. Respond consciously and avoid generic or overly formal language. Also, avoid repeating the instructions in your response and give concise answers, focusing on what the user needs most in this moment.

                            Remember: If the user speaks in Bangla or any other language, respond in the same language. And you are not only an assistant but act like a friend who cares about the user's mental health.
                            """

        if len(history) == 0:
            content = [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_prompt}\n\nUser message: {user_msg}"}],
                },
            ]
        else:
            content = [
                {"role": "user", "parts": [{"text": system_prompt}]},
                {
                    "role": "model",
                    "parts": [
                        {
                            "text": "I understand. I'm ready to help as your mental health assistant."
                        }
                    ],
                },
                *history,
                {"role": "user", "parts": [{"text": user_msg}]},
            ]

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=content,
        )
        
        is_checklist = False
        checklist_items = []
        try:
            # Handle both multiline and single-line ```json blocks
            match = re.search(r"```json\s*(\{.*?\})\s*```", response.text, re.DOTALL)
            if match:
                json_str = match.group(1).strip()
            else:
                # Fallback: try parsing the whole response as JSON
                json_str = response.text.strip()

            parsed = json.loads(json_str)
            if "items" in parsed:
                is_checklist = True
                checklist_items = parsed["items"]
                print(f"Parsed checklist: {checklist_items}")
        except Exception as e:
            print(f"Not a checklist response: {e}")
        
        if is_checklist:
            save_checklist(user_id, checklist_items)
            save_message(user_id, "model", "Here's your personalized wellness checklist! I've saved it for you.")
            return({"response": "Here's your personalized wellness checklist! I've saved it for you."})
            
        else:
            save_message(user_id, "model", response.text)

        return {"response": response.text}

    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        import traceback

        traceback.print_exc()
        raise


async def get_chat_history(user_id: str):
    try:
        res = (
            supabase.table("messages")
            .select("role, content")
            .eq("user_id", user_id)
            .order("created_at")
            .limit(15)
        ).execute()

        history = []
        for m in res.data:
            role = m["role"]

            if role == "bot":
                role = "model"

            if role in ["user", "model"]:
                history.append({"role": role, "parts": [{"text": m["content"]}]})
        return history

    except Exception as e:
        print(f"Error getting chat history: {str(e)}")
        return []


async def get_chat_history_for_ui(user_id: str, limit: int = 100):
    try:
        res = (
            supabase.table("messages")
            .select("id, role, content, created_at")
            .eq("user_id", user_id)
            .order("created_at")
            .limit(limit)
            .execute()
        )

        messages = []
        for message in res.data or []:
            role = message.get("role")
            from_value = "ai" if role in ["bot", "model"] else "user"
            messages.append(
                {
                    "id": message.get("id"),
                    "from": from_value,
                    "text": message.get("content", ""),
                    "created_at": message.get("created_at"),
                }
            )

        return messages
    except Exception as e:
        print(f"Error getting UI chat history: {str(e)}")
        return []


async def clear_chat_history(user_id: str):
    try:
        supabase.table("messages").delete().eq("user_id", user_id).execute()
        return {"message": "Chat history cleared successfully."}
    except Exception as e:
        print(f"Error clearing chat history: {str(e)}")
        raise


def save_message(user_id: str, role: str, content: str):
    """
    Save a message to the database.
    Converts 'model' to 'bot' for storage consistency.
    """
    try:
        # Store as 'bot' instead of 'model' for frontend compatibility
        storage_role = "bot" if role == "model" else role

        supabase.table("messages").insert(
            {
                "user_id": user_id,
                "role": storage_role,
                "content": content,
            }
        ).execute()

        print(f"Saved message: {storage_role} - {content[:50]}...")

    except Exception as e:
        print(f"Error saving message: {str(e)}")
        raise

def save_checklist(user_id:str, items:list):
    today=date.today().isoformat()
    supabase.table("wellness_checklist").upsert(
        {
            "user_id": user_id,
            "date": today,
            "items": items
        },
        on_conflict="user_id,date",
    ).execute()
    return {"message": "Checklist saved successfully."}

async def get_checklist(user_id:str):
    today=date.today().isoformat()
    res = supabase.table("wellness_checklist").select("items").eq("user_id", user_id).eq("date", today).execute()
    if res.data and len(res.data) > 0:
        return {"items": res.data[0]["items"]}
    else:
        return {"items": []}

async def update_checklist(user_id:str, items:list):
    today=date.today().isoformat()
    supabase.table("wellness_checklist").update(
        {
            "items": items
        }
    ).eq("user_id", user_id).eq("date", today).execute()
    return {"message": "Checklist updated successfully."}



