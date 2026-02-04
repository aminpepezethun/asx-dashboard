export async function getScraperStatus() {
    const GITHUB_TOKEN = process.env.GITHUB_PAT;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    
    // We check for both 'in_progress' AND 'queued' 
    // This prevents a second trigger while the first is waiting for a GitHub runner
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?event=repository_dispatch&per_page=1`;

    try {
        const res = await fetch(url, {
            headers: { 
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            },
            next: { revalidate: 0 } 
        });

        const data = await res.json();
        
        if (!data.workflow_runs || data.workflow_runs.length === 0) return false;

        const latestRun = data.workflow_runs[0];
        const status = latestRun.status;

        // Return true if it's currently doing anything other than "completed"
        return status === "in_progress" || status === "queued" || status === "waiting";
    } catch (error) {
        console.error("Error checking GitHub status:", error);
        return false; // Default to false so the UI doesn't lock up on API error
    }
}