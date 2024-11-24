import { HfInference } from '@huggingface/inference'
export const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)