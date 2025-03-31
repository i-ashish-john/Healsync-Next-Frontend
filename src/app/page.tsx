import { 
  ArrowRightIcon,
  CalendarIcon,
  MessageSquareIcon,
  ShieldIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";

import Link from "next/link";
import { Button } from "../components/ui/btt";
import { Card, CardContent } from "../components/ui/card";

// Feature data for mapping
const features = [
  {
    icon: <UsersIcon className="w-10 h-10 text-purple-600" />,
    title: "Find Your Doctor",
    description:
      "Browse through departments and find specialized doctors that match your healthcare needs",
  },
  {
    icon: <CalendarIcon className="w-10 h-10 text-purple-600" />,
    title: "Easy Appointments",
    description:
      "Book appointments with just a few clicks and manage your schedule efficiently",
  },
  {
    icon: <MessageSquareIcon className="w-10 h-10 text-purple-600" />,
    title: "Secure Chat",
    description:
      "Chat directly with your healthcare provider after booking your appointment",
  },
  {
    icon: <VideoIcon className="w-10 h-10 text-purple-600" />,
    title: "Video Consultations",
    description:
      "Have face-to-face consultations with your doctor from the comfort of your home",
  },
  {
    icon: <ShieldIcon className="w-10 h-10 text-purple-600" />,
    title: "Protected Health Data",
    description:
      "Your health information is encrypted and securely stored with us",
  },
  {
    icon: <UsersIcon className="w-10 h-10 text-purple-600" />,
    title: "Patient Reviews",
    description:
      "Read honest reviews from other patients to make informed decisions",
  },
];

export default function Home() {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1108px]">
        <div className="relative [background:linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,1)_100%)] py-20">
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center mb-20">
            <h1 className="w-full max-w-[641px] text-6xl font-bold text-center mb-6 [background:linear-gradient(90deg,rgba(147,51,234,1)_0%,rgba(121,40,202,1)_100%)] [-webkit-background-clip:text] bg-clip-text text-transparent [font-family:'Inter',Helvetica]">
              Welcome to HealSync
            </h1>

            <p className="max-w-[710px] text-xl text-gray-600 text-center mb-12 [font-family:'Inter',Helvetica]">
              Connect with top healthcare professionals and manage your health
              journey
              <br />
              seamlessly
            </p>

            <div className="flex gap-4">
              <Link href="/patient/signup">
                <Button className="h-12 px-6 bg-purple-600 rounded-[10px] [font-family:'Inter',Helvetica] font-medium text-lg">
                  Login as Patient
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/doctor/login">
                <Button
                  variant="outline"
                  className="h-12 px-6 border-purple-600 text-purple-600 rounded-[10px] [font-family:'Inter',Helvetica] font-medium text-lg"
                >
                  Login as Doctor
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-zinc-950 text-center mb-12 [font-family:'Inter',Helvetica]">
              Why Choose HealSync?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="rounded-xl border-zinc-200 shadow-[0px_1px_2px_#0000000d]"
                >
                  <CardContent className="p-6">
                    <div className="mb-5">{feature.icon}</div>
                    <h3 className="text-xl font-normal text-zinc-950 mb-6 [font-family:'Inter',Helvetica]">
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-600 [font-family:'Inter',Helvetica]">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-[#9333ea0d] rounded-3xl p-16 text-center">
            <h2 className="text-3xl font-bold text-zinc-950 mb-6 [font-family:'Inter',Helvetica]">
              Ready to take control of your health?
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-[751px] mx-auto [font-family:'Inter',Helvetica]">
              Join thousands of patients who have improved their healthcare
              experience with
              <br />
              HealSync
            </p>

            <Link href="/patient/signup">
              <Button className="h-12 px-8 bg-purple-600 rounded-[10px] [font-family:'Inter',Helvetica] font-medium text-lg">
                Explore Dashboard
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}