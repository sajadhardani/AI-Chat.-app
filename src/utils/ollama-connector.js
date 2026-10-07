"use server"

export const OllamaConnector = async (prompt) => {
    const formattedPrompt = `Please generate a suitable title for the following text and then produce the content.  
Provide the title in this format: "title: [Your Title]"  
Then, write the main content in the following format: "content: [Your Content]"  
    
    Input text:
    ${prompt}`;
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "deepseek-r1:1.5b",
            prompt: formattedPrompt,
            stream: false
        })
    })

    const data = await response.json()

    console.log(data, "is data")

    const responseText = data.response
        .replace(/<think>[\s\S]*?<\/think>/g, "")
        .trim();

    // console.log(responseText, "||||||||||||||||| is responseText")

    const titleMatch = responseText.match(/عنوان:\s*(.+)/i);
    const titleEnMatch = responseText.match(/title:\s*(.+)/i);
    const title = titleMatch ? titleMatch[1].trim() : titleEnMatch ? titleEnMatch[1].trim() : "عنوان نامشخص";

    let content = responseText.replace(/عنوان:\s*.+\n?/i, "").replace(/title:\s*.+\n?/i, "");
    content = content.replace(/Content:\s*/i, "").replace(/content:\s*/i, "");
    // console.log(title, "-----------------------is title", "\n", content, "--------------------is content")

    return { title, content, created_at: data.created_at }
}