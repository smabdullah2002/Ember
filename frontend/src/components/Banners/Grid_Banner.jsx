import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  borderRadius: "16px",
  color: theme.palette.text.secondary,
}));

export default function Grid_Banner() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} className="mt-10 mb-10">


        <Grid size={6}>
          <Item className="min-h-80 ml-40 ">
            <div className="flex w-full">
              {/* LEFT HALF*/}
              <div
                className="w-1/2 flex flex-col rounded-tl-xl rounded-bl-xl p-4 min-h-80
                              bg-linear-to-bl from-stone-800 via-stone-600 to-purple-300
                              transition-all duration-500 ease-in-out"
              >
                <div className="flex flex-col gap-4 mt-5">
                  {/* Left message */}
                  <div className="flex justify-end p-4 hover-3d">
                    <h1 className="text-xl max-w-xs rounded-xl rounded-br-none shadow p-2 bg-white border-3 border-stone-800">
                      hey!
                    </h1>
                  </div>

                  {/* Right message */}
                  <div className="flex justify-start p-4 hover-3d">
                    <h1 className="text-xl max-w-40 rounded-xl rounded-tl-none shadow p-2 bg-stone-800 border-3 border-white text-white">
                      Great to meet you, let's get started.
                    </h1>
                  </div>
                </div>
              </div>

              {/* RIGHT HALF*/}
              <div className="w-1/2 flex flex-col justify-center p-10">
                <h1 className="text-xl text-white font-bold">
                  Don't know where to start? Bliss does
                </h1>

                <h1 className="text-xl text-white mt-10">
                  Whether you're overwhelmed, curious, or just need to talk it
                  out, Ash can help.
                </h1>
              </div>
            </div>
          </Item>
        </Grid>

        <Grid size={6}>
          <Item className="min-h-80 mr-40 hover-3d">
            <div className="flex flex-row">
              <div className="w-1/2 min-h-80 rounded-tl-xl rounded-bl-xl overflow-hidden">
                <img
                  src="https://framerusercontent.com/images/m98MmPXlbmF9tdNEeBETMRlXQ.png?width=780&height=481"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <div className="divider lg:divider-horizontal divider-neutral min-h-70 "></div> */}

              <div className="w-1/2 flex flex-col justify-center p-10">
                <h1 className="text-xl text-white font-bold">
                  Talk or text 24/7, Ash listens
                </h1>
                <h1 className="text-xl text-white mt-10">
                  Sometimes you just need to say things out loud. You can talk to Bliss like you would on a a phone call or text Bliss for prompt, private guidance.

                </h1>
              </div>

            </div>
          </Item>
        </Grid>


        <Grid size={4}>
          <Item className="min-h-80 ml-40 hover-3d">
            <div className="flex flex-col justify-between">
              <div className="h-40 w-full overflow-hidden rounded-t-xl">
                <img
                  src="https://framerusercontent.com/images/amthoBqdFcjsHURERJoD1j7Ow.png?width=779&height=481"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <h1 className="text-xl text-white font-bold">
                  Bliss discovers your patterns
                </h1>
                <h1 className="text-xl text-white mt-5">
                  Each conversation helps Bliss understand you more and more deeply.
                </h1>
              </div>
            </div>
          </Item>
        </Grid>
        <Grid size={4}>
          <Item className="min-h-80 hover-3d">
            <div className="flex flex-col justify-between">
              <div className="h-40 w-full overflow-hidden rounded-t-xl">
                <img
                  src="image_4.jpeg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <h1 className="text-xl text-white font-bold">
                  Breakthrough insights from day one
                </h1>
                <h1 className="text-xl text-white mt-5">
                  From your first conversation, Bliss works hard to identify patterns and connect the dots between your thoughts
                </h1>
              </div>
            </div>
          </Item>
        </Grid>
        <Grid size={4}>
          <Item className="min-h-80 mr-40 hover-3d">
            <div className="flex flex-col justify-between">
              <div className="h-40 w-full overflow-hidden rounded-t-xl relative">
                <img
                  src="https://framerusercontent.com/images/HpyuDT0n3FU5F70FaqmXbqKFTEQ.svg?width=250&height=229"
                  alt=""
                  className="w-full h-full object-cover bg-stone-800"
                />

                
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-amber-100 text-xl font-semibold">
                   Get new insights
                  </h2>
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-xl text-white font-bold">
                  Bliss takes you on a journey
                </h1>
                <h1 className="text-xl text-white mt-5">
                  Come with your own agenda or let Bliss guide the way with new insights.
                </h1>
              </div>
            </div>

          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
