module.exports = (req, res) => {
    res.status(200).json({
        success: true,
        status: "online",
        message: "TikTok Streamers API is working.",
        database: "not connected",
        users: 0,
        streamers: 0,
        liveStreams: 0,
        timestamp: new Date().toISOString()
    });
};