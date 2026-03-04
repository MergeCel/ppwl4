import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  .post("/request",
    ({ body }) => ({
      message: "Success",
      data: body
    }),
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )

  .get(
    "/products/:id",
    ({ params, query }) => {
      const sort = query.sort ?? "asc";

      return {
        success: true,
        productId: params.id,
        sort,
        message: `Product ${params.id} sorted ${sort}`
      };
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      query: t.Object({
        sort: t.Optional(
          t.Union([
            t.Literal("asc"),
            t.Literal("desc")
          ])
        )
      }),
      response: t.Object({
        success: t.Boolean(),
        productId: t.Number(),
        sort: t.Union([
          t.Literal("asc"),
          t.Literal("desc")
        ]),
        message: t.String()
      })
    }
  )

.get(
  "/admin",
  () => ({
    stats: 99
  }),
  {
    response: {
      200: t.Object({
        stats: t.Number()
      }),
      401: t.Object({
        success: t.Boolean(),
        message: t.String()
      })
    },

    beforeHandle({ headers, set }) {
      if (headers.authorization !== "Bearer 123") {
        set.status = 401
        return {
          success: false,
          message: "Unauthorized"
        }
      }
    }
  }
)

  .get(
    "/stats",
    () => ({
      total: 100,
      active: 75
    }),
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number()
      })
    }
  )

  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);