export default {
    apps : [{
        name: "keech",
        script: "npm",
        args: "run start",
        watch: true, // Optional: Watch for file changes and restart
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
};