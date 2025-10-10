
import "dotenv/config";
import * as joi from 'joi';

interface envsVars {
    PORT: number;
    NATS_SERVERS: string[]
}


const envsSchema =  joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string().required())
})
.unknown(true);


const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(",")
});

if(error){
    throw new Error(`Config validation error: ${error.message}`);
}

const envsVars: envsVars = value



export const envs = {
    PORT: envsVars.PORT,
    NATS_SERVERS : envsVars.NATS_SERVERS
}