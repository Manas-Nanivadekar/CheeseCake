import { useNavigate } from "react-router-dom";
import HighlightBox from "./HighlightBox";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const HeroSection = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <div className="relative">
      {/* Yellow section */}
      <section className="bg-[#FFFC6D] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pb-48">
            <h1 className="text-4xl font-bold tracking-tight text-[#0A0B1F] sm:text-5xl md:text-6xl">
              <span className="block">Auto-generate courses.</span>
              <span className="block mt-2">
                Gamify your learning experience.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#0A0B1F]/80 flex">
              Start now and supercharge learning experiences like its a piece of
              Cheese Cake!
            </p>

            <div className="mt-10 flex justify-center gap-4">
              {isLoggedIn ? (
                <Button
                  onClick={() => navigate("/login")}
                  className="px-8 py-6 text-lg bg-[#0A0B1F] text-white hover:bg-[#3EEEC0] transition-colors duration-300 rounded-full"
                >
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="Google"
                    className="w-10 h-10 mr-2"
                  />
                  Sign up with Google
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/pathway/view")}
                  variant="outline"
                  className="px-8 py-6 text-lg border-[#0A0B1F] text-[#0A0B1F] hover:bg-white hover:text-[#0A0B1F] transition-colors duration-300 rounded-full"
                >
                  Explore Pathways
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
        style={{ top: "35%" }}
      >
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src=""
            title="Product Demo Video"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Light gray section */}
      <section className="bg-[#f7f8fa] pt-52">
        <div className="container mx-auto px-4 py-24">
          <h1 className="mx-auto max-w-5xl text-center text-3xl font-bold leading-tight md:text-5xl">
            With Cheesecake, we help you{" "}
            <HighlightBox color="bg-[#3EEEC0]">generate </HighlightBox> engaging
            pathways and engaging courses with{" "}
            <HighlightBox color="bg-[#94a4ff]">gamified twists</HighlightBox> to
            help students learn and also compete based on our{" "}
            <HighlightBox color="bg-[#FFB98A]">leaderboards</HighlightBox>.
          </h1>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
