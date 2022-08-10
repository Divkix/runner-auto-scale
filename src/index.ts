import { serve } from "https://deno.land/std@0.151.0/http/server.ts"
import { Context, Hono } from "https://deno.land/x/hono@v2.0.7/mod.ts"
import { WorkflowRun } from "./customTypes.ts"
import { Config } from "./config.ts"
import { manageJobs, runPendingJobs } from './helpers.ts'
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";


const app = new Hono()
const runs = new WorkflowRun()
const config = new Config().loadConfig()


app.post('/', async (c: Context) => {
    const jsonData = await c.req.json()
    await manageJobs(jsonData, runs)
    return new Response(null, { status: 200 })
})

console.log(config)

serve(app.fetch, { port: 8000 })

// Run Job in every minute
cron('* * * * *', () => {
    console.log('checking for pending jobs...')
    runPendingJobs(runs, config);
});
