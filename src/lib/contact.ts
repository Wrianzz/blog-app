const functionUrl = import.meta.env.VITE_CONTACT_FUNCTION_URL;

if (!functionUrl) {
  throw new Error("Missing VITE_CONTACT_FUNCTION_URL");
}

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(input: ContactInput) {
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...input,
      website: "" // honeypot field
    })
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || "Failed to send message.");
  }

  return data;
}