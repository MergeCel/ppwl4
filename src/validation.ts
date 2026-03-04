import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .onRequest(({ request }) => {
    console.log(request.method, request.url)
    console.log(new Date().toISOString())
  })
  .post("/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )

  .get(
    "/ping",
    () => {
      return {
        success: true,
        message: "Server OK"
      }
    },
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    }
  )

  .listen(3000);


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
