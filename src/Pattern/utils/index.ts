const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

async function updateUser(user: any, updates: any, signal?: any) {
  await sleep(1500); // simulate a real-world wait period
  if (`${updates.tagline} ${updates.bio}`.includes("fail")) {
    return Promise.reject({ message: "Something went wrong" });
  }
  return { ...user, ...updates };
}

export { updateUser };
