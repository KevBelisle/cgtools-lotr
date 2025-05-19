import { useCallback, useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { IconButton } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { LuCloudDownload } from "react-icons/lu";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, _], //setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);

      if (r) {
        setInterval(
          () => {
            r.update();
          },
          60 * 60 * 1000 // 1 hour
        );
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
      toaster.create({
        title: "Error registering service worker",
        description: "App will not be available offline.",
        type: "warning",
        duration: 5000,
      });
    },
    onOfflineReady() {
      console.log("App is ready to work offline");
      setOfflineReady(true);
    },
  });

  const updateApp = useCallback(
    () => updateServiceWorker(true),
    [updateServiceWorker]
  );

  useEffect(() => {
    if (offlineReady) {
      toaster.create({
        title: "App ready to work offline",
        description: "You can now use the app without internet connection.",
        type: "success",
        duration: 5000,
      });
    }
    if (needRefresh) {
      toaster.create({
        title: "App update available",
        description: "Update now to get get the new version.",
        type: "info",
        duration: 5000,
      });
    }
  }, [offlineReady, needRefresh]);

  // const close = () => {
  //   setOfflineReady(false);
  //   setNeedRefresh(false);
  // };

  if (!needRefresh) {
    return <></>;
  }

  return (
    needRefresh && (
      <IconButton
        onClick={updateApp}
        variant="ghost"
        bgColor="transparent"
        color="white"
        aria-label="Update app"
        size="sm"
      >
        <LuCloudDownload />
      </IconButton>
    )
  );
}

export default ReloadPrompt;
