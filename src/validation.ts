import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
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
.listen(3000);


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

app.get(
    '/products/:id', 
    ({ params, query }) => {
      return {
        id: params.id,
        sort: query.sort,
        status: "success",
        timestamp: Date.now()
      }
    }, 
    {
      params: t.Object({
        id: t.Number()
      }),

      query: t.Object({
        sort: t.String({ enum: ["asc", "desc"] })
      }),

      response: t.Object({
        id: t.Number(),
        sort: t.String(),
        status: t.String(),
        timestamp: t.Number()
      })
    }
  )

app.get(
    '/stats',
    () => {
      return {
        total: 100,
        active: 75
      }
    },
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number()
      })
    }
  )
