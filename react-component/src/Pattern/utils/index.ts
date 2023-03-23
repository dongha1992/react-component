const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

async function updateUser(user: any, updates: any, signal?: any) {
  await sleep(1500); // simulate a real-world wait period
  if (`${updates.tagline} ${updates.bio}`.includes("fail")) {
    return Promise.reject({ message: "Something went wrong" });
  }
  return { ...user, ...updates };
}

type FunctionType = (...args: any[]) => void;

function callAll(...fns: Array<FunctionType | undefined>) {
  return (...args: any[]) => {
    fns.forEach((fn) => fn && fn(...args));
  };
}

export { updateUser, callAll };
