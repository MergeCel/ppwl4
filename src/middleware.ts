import { Elysia, t } from "elysia"
import {openapi} from "@elysiajs/openapi";

const app = new Elysia()


// Global Logger
app.onRequest(({ request }) => {
  console.log("📥", request.method, request.url)
  console.log("🕒", new Date().toISOString())
})

app.onRequest(({ request, set }) => {
  if (request.headers.get("x-block") === "true") {
    set.status = 403
    return { message: "Blocked" }
  }
})

app.onAfterHandle(({ response }) => {
 return {
   success: true,
   data: response
 }
})


app.get("/profile", () => ({
 name: "Nama kamu"
}))

app.get(
 "/dashboard",
 () => ({
   message: "Welcome to Dashboard"
 }),
 {
   beforeHandle({ headers, set }) {
     if (!headers.authorization) {
       set.status = 401
       return {
         success: false,
         message: "Unauthorized"
       }
     }
   }
 }
)

app.post(
 "/register",
 ({ body }) => body,
 {
   body: t.Object({
     name: t.String({ minLength: 3 }),
     email: t.String({ format: "email" })
   })
 }
)


app.onError(({ code, error, set }) => {


 if (code === "VALIDATION") {
   set.status = 400
   return {
     success: false,
     message: "Validation Error",
     detail: error.message
   }
 }


 if (code === "NOT_FOUND") {
   set.status = 404
   return {
     message: "Route not found"
   }
 }


 set.status = 500
 return {
   message: "Internal Server Error"
 }
})

app.get("/", () => "Hello Middleware")


app.listen(3000)
console.log("Server running at http://localhost:3000")
