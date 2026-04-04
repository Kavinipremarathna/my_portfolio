export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // TODO: Connect to MongoDB or file store
    // For now, return mock data
    const mockProjects = [
      {
        id: 1,
        title: "Sample Project",
        description: "This is a sample project",
        tags: ["React", "Node.js"],
      },
    ];
    res.status(200).json(mockProjects);
  } else {
    res.status(405).json({ msg: "Method Not Allowed" });
  }
}
