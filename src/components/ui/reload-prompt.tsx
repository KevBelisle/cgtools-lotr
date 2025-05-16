import { useContext, useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toaster } from "@/components/ui/toaster";
import { SqljsDbContext } from "@/sqljs/SqljsProvider";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
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
    },
    onOfflineReady() {
      console.log("App is ready to work offline");
      setOfflineReady(true);
    },
  });

  // const sqljsContext = useContext(SqljsDbContext);

  if (!SqljsDbContext) {
    throw new Error("useSqljsQuery must be used within a SqljsProvider");
  }

  // useEffect(() => {
  //   console.log({ offlineReady, savedToOpfs: sqljsContext.savedToOpfs });
  //   if (offlineReady && sqljsContext.savedToOpfs) {
  //     toaster.create({
  //       title: "App ready to work offline",
  //       description: "You can now use the app without internet connection.",
  //       type: "success",
  //       duration: 5000,
  //     });
  //   }
  // }, [offlineReady, sqljsContext.savedToOpfs]);

  useEffect(() => {
    console.log({ offlineReady, needRefresh });
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

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>
                New content available, click on reload button to update.
              </span>
            )}
          </div>
          {needRefresh && (
            <button
              className="ReloadPrompt-toast-button"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button className="ReloadPrompt-toast-button" onClick={() => close()}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default ReloadPrompt;
