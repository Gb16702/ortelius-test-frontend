import Button from "./components/Button";
import ChatCallToAction from "./components/ChatCallToAction";
import { useState } from "react";
import Modal from "./components/Modal";
import Signin from "./components/SignIn";
import { useUserStore } from "./stores/userStore";
import { Helmet } from "react-helmet-async";

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const { isAuthenticated, logout } = useUserStore();

  return (
    <>
      <Helmet>
        <title>OrteliusAI</title>
        <meta name="description" content="OrteliusAI" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta property="og:title" content="OrteliusAI" />
        <meta property="og:description" content="Your Logistics AI Assistant" />
        <meta property="og:image" content={`${window.location.origin}/ortelius_o.png`} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-domain.com/" />
        <meta property="twitter:title" content="OrteliusAI" />
        <meta property="twitter:description" content="Your Logistics AI Assistant" />
        <meta property="twitter:image" content={`${window.location.origin}/ortelius_o.png`} />
      </Helmet>

      <main className="h-screen w-full flex items-center justify-center bg-whitish max-lg:px-4">
        {loginModalOpen && (
          <Modal className="max-md:w-full" open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
            <Signin onClose={() => setLoginModalOpen(false)} />
          </Modal>
        )}
        <Button
          label={isAuthenticated ? "Logout" : "Login"}
          type="button"
          variant="default"
          additionalClasses="absolute top-5 right-5 px-6 py-2 font-bold rounded-full text-sm cursor-pointer z-50"
          onClick={() => {
            if (isAuthenticated) {
              logout();
            } else {
              setLoginModalOpen(true);
            }
          }}
        />
        <ChatCallToAction />
      </main>
    </>
  );
}

export default App;
