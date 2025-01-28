import HowItWorks from "@/components/lnading/howItWorks/HowItWork";
import Features from "@/components/lnading/Features";
import Hero from "@/components/lnading/Hero";
import FooterBar from "@/components/lnading/FooterBar";
import NewsLetter from "@/components/lnading/newsLetter/NewsLetter";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default async function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <Hero />
        {/* <Features /> */}
        <HowItWorks />
      </MaxWidthWrapper>
      <NewsLetter />
      <FooterBar />
    </>
  );
}
