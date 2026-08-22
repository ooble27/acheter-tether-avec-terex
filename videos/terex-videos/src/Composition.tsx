import { Composition } from "remotion";
import { BuyUsdtTutorial, BUY_USDT_DURATION } from "./tutorials/buy-usdt/BuyUsdtTutorial";

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="BuyUsdtTutorial"
        component={BuyUsdtTutorial}
        durationInFrames={BUY_USDT_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
