# icbc_automation
Instead of checking ICBC site for appointments, just run this and get emails on available appointments near you.

###  * Some knowledge in NodeJS is required for this *

# Preparing
- Pull the repo locally
- Run `npm i` 
- Create a `.env` file by copying `.env.sample` and set the values you use to login to ICBC to check for appointments. Set the email you would like to receive the results to.
- You can change the threshold of how often the check is happening by changing the `minutes` variable in `index.ts`.
- If you don't live in Vancouver and want to check out other icbcs, just change the coordinates in `src/methods/get_nearby_icbcs.ts` (I haven't tested it tho)
- If you want to change the license type, change `examType` both in `src/methods/get_available_appointments.ts` and in `src/methods/get_nearby_icbcs.ts` 

# Running
- Run `npm run start:dev` and leave the process running :P


# Notes 
Yes I know the code is messy. Yes I know it is not tested and yes I know the API keys for Courier are exposed and can be abused.
I didn't really care for those as this had the purpose of finding me appointments until I pass the road test. So I wrote a very quick and dirty lil project..


I encourage you create your own Courier account and your own template if you rely on this to give you those emails. (Or even setup your own SMTP).
Cuz currently if many people are gonna use it with my free plan, it is gonna reach the maximum notifications and won't send anymore.
In order to setup your own account, See [this](https://www.courier.com/blog/how-to-send-emails-with-node-js/) for more info. 

### Feel free to create pull request if you think it can help other people 
