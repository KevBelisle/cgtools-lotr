import createPersistedState from "@plq/use-persisted-state";
import storage from "@plq/use-persisted-state/lib/storages/session-storage";

const [usePersistedState] = createPersistedState("search-options", storage);

export { usePersistedState };
