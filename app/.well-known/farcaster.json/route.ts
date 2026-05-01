export async function GET() {
  const rootUrl = process.env.APP_URL || 'http://localhost:3000';
  
  return Response.json({
    accountAssociation: {
      header: "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
      payload: "eyJkb21haW4iOiJhcHAuZXhhbXBsZS5jb20ifQ",
      signature: "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwI"
    },
    miniapp: {
      version: "1",
      name: "Folk Wallet",
      homeUrl: rootUrl,
      iconUrl: `${rootUrl}/icon.png`,
      splashImageUrl: `${rootUrl}/splash.png`,
      splashBackgroundColor: "#0A0B0D",
      webhookUrl: `${rootUrl}/api/webhook`,
      subtitle: "Professional Onchain Wallet",
      description: "Manage your assets and community NFTs in one place.",
      screenshotUrls: [],
      primaryCategory: "finance",
      tags: ["wallet", "base", "miniapp"],
      heroImageUrl: `${rootUrl}/hero.png`,
      tagline: "Your assets, your folk.",
      ogTitle: "Folk Wallet",
      ogDescription: "A professional onchain experience.",
      ogImageUrl: `${rootUrl}/og.png`,
      noindex: true
    }
  });
}
