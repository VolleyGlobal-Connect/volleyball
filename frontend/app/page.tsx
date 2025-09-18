import Image from "next/image";
// import Volleyball from "../public/Volleyball.png"
import Payment from "@/components/payment";
export default function Home() {

  return (
    <main className="min-h-screen nata relative w-[100%] overflow-hidden flex items-center  flex-col mt-24  px-4 space-y-6">
      {/* <Image src={Volleyball} alt="volleyballImage" placeholder="blur"
        quality={100}
        fill
        priority
        style={{
          objectFit: 'cover',
        }} /> */}

      <div className=" font-medium flex flex-col max-w-6xl items-start  gap-6">
        <h1 className="text-5xl ">{`Serve, Support, and Spike for a Cause!`}</h1>
        <p className="text-2xl ">{`Join us in empowering our volleyball community. Every contribution brings us closer to new opportunities, stronger teams, and lasting memories on and off the court.`}</p>
      </div>
      <div className="text-2xl max-w-6xl space-y-8">
        <p>{`
            Volleyball is more than a sport—it's teamwork, discipline, and passion. With your support, we can provide better equipment, training, and opportunities for athletes who dream of playing at their full potential. Your donation helps fund:

            Essential gear (balls, nets, uniforms)

            Tournament fees and travel costs

            Youth development programs

            Community outreach and training sessions
          `}
        </p>

        <p>
          {` No matter the size, your donation fuels the growth of volleyball in our community. Together, we can build champions and inspire the next generation of players.`}
        </p>

        <p>{`
        💙 Your support is more than money—it’s encouragement, hope, and a vote of confidence for every player who steps onto the court. Help us keep the spirit of the game alive!`}</p>
      </div>
      <Payment />

    </main >
  );
}
