const BannerService = require('./bannerP.services');

exports.getBanner = async (req, res) => {
    try {
        const banner = await BannerService.getBanner();
        res.status(200).json({ banner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banner' });
    }
};





