

// responce gpt 

export const gptResponceJustText = {
    "id": "chatcmpl-BhiXCILzKAtbsClCo7J3sZqMjWmTd",
    "object": "chat.completion",
    "created": 1749758994,
    "model": "gpt-4-turbo-2024-04-09",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Я просто программа, так что у меня нет чувств или настроения. Но спасибо за интерес! Чем могу помочь?",
                "refusal": null,
                "annotations": []
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 34,
        "completion_tokens": 44,
        "total_tokens": 78,
        "prompt_tokens_details": {
            "cached_tokens": 0,
            "audio_tokens": 0
        },
        "completion_tokens_details": {
            "reasoning_tokens": 0,
            "audio_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
        }
    },
    "service_tier": "default",
    "system_fingerprint": "fp_de235176ee"
}

// functions

export const fakeResponceGPR = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(gptResponceJustText)
		}, 1000);
	})
}
