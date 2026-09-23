export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY is not configured in Cloudflare." }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON request." }, 400); }
  const { business="Other", platform="TikTok", language="English", type="Video Idea", topic="" } = body || {};
  const businesses=["Restaurant","Barber","Gym","Car Wash","Real Estate","Online Shop","Other"];
  const platforms=["TikTok","Instagram Reels","YouTube Shorts"];
  const languages=["English","Arabic"];
  const types=["Video Idea","Hook","30-Second Script","Caption","Hashtags","7-Day Content Plan"];
  if(!businesses.includes(business)||!platforms.includes(platform)||!languages.includes(language)||!types.includes(type)) return json({error:"One or more selected options are invalid."},400);
  const cleanTopic=String(topic||"").trim().slice(0,500);
  const model=env.OPENAI_MODEL||"gpt-5.6-luna";
  const prompt=`You are UAE Content AI, a practical social-media content assistant for UAE creators and small businesses.\n\nCreate ONE useful piece of original content based on these settings:\nBusiness type: ${business}\nPlatform: ${platform}\nLanguage: ${language}\nContent type: ${type}\nTopic/offer: ${cleanTopic||"No specific topic provided"}\n\nRequirements:\n- Make the content natural and ready to copy/paste.\n- Adapt wording to a UAE audience without making unsupported claims.\n- If language is Arabic, write the main content in natural Modern Standard Arabic with simple social-media wording.\n- If content type is 30-Second Script, include a hook, timestamps, spoken lines, visual/action suggestions, and a short call to action.\n- If content type is 7-Day Content Plan, give seven distinct days.\n- If content type is Hashtags, give a useful set of relevant hashtags.\n- Do not explain your process. Return only the requested content.`;
  try {
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.OPENAI_API_KEY}`},body:JSON.stringify({model,input:prompt,max_output_tokens:900})});
    const data=await response.json();
    if(!response.ok) return json({error:data?.error?.message||"OpenAI request failed."},response.status);
    const output=data?.output_text||data?.output?.flatMap(i=>i?.content||[])?.map(p=>p?.text||"")?.join("")?.trim();
    if(!output) return json({error:"The AI returned an empty response."},502);
    return json({output});
  } catch { return json({error:"Server error while contacting the AI service."},500); }
}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});}
