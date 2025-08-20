import { useEffect } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

const DemoCallbackPage = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    const processToken = async () => {
      const token = router.query.token;

      if (!isLoaded || !signIn || !setActive || !token) {
        return;
      }

      if (typeof token !== "string") {
        console.error("Invalid token format received.");
        router.push("/sign-in"); // Redirect to safety
        return;
      }

      try {
        const signInAttempt = await signIn.create({
          strategy: "ticket",
          ticket: token,
        });

        if (
          signInAttempt.status === "complete" &&
          signInAttempt.createdSessionId
        ) {
          await setActive({ session: signInAttempt.createdSessionId });

          router.push("/dashboard");
        } else {
          console.error(
            "Clerk sign-in attempt was not completed:",
            signInAttempt
          );
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Clerk: An error occurred during sign-in:", error);
        router.push("/sign-in");
      }
    };

    processToken();
  }, [isLoaded, signIn, setActive, router.query.token, router]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-2xl font-semibold text-gray-700">
        Logging you in securely...
      </div>
      <div className="mt-4 text-gray-500">Please wait a moment.</div>
    </div>
  );
};

export default DemoCallbackPage;
