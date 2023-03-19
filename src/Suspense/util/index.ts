function createResource<T>(promise: Promise<T>): { read: () => T } {
  let status: "pending" | "success" | "error" = "pending";
  let result: T | any = promise.then(
    (resolved: T) => {
      status = "success";
      result = resolved;
    },
    (rejected: any) => {
      status = "error";
      result = rejected;
    }
  );
  return {
    read() {
      if (status === "pending") throw result;
      if (status === "error") throw result;
      if (status === "success") return result as T;
      throw new Error("This should be impossible");
    },
  };
}

function preloadImage(src: string) {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => resolve(src);
  });
}

export { createResource, preloadImage };
