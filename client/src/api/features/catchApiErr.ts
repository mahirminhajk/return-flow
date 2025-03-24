import { isAxiosError } from "axios";

export function catchApiErr(err: unknown) {
  console.log("catchApiErr", err);
  
  if (isAxiosError(err) && err.response) {
    throw err.response.data;
  } else if (err instanceof Error) {
    throw { message: err.message };
  } else {
    throw { message: "An error occurred. Please try again later."  };
  }
}
