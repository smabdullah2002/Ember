from fastapi import FastAPI, HTTPException
from schemas.comment import CommentSchema
from config import supabase
from textblob import TextBlob
from nltk.sentiment.vader import SentimentIntensityAnalyzer

sid = SentimentIntensityAnalyzer()

def is_toxic(content: str):
    vader_score = sid.polarity_scores(content)["compound"]
    analysis = TextBlob(content)
    polarity = analysis.sentiment.polarity
    
    avg_score = (vader_score + polarity) / 2
    return avg_score


async def add_comment(data: CommentSchema, user_id: str):
    toxicity_check = is_toxic(data.content)
    print("Toxicity Check Polarity:", toxicity_check)
    # if toxicity_check:
    #     raise HTTPException(
    #         status_code=400, detail="Comment content is considered toxic."
    #     )
    response = (
        supabase.table("comments")
        .insert({"post_id": data.post_id, "user_id": data.user_id, "comment": data.content})
        .execute()
    )

    if not response:
        raise HTTPException(status_code=500, detail="Failed to add comment.")
    return response.data
