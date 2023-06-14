const BannerService = require('./bannerP.services');

exports.createBanner = async (req, res) => {
    try {
        const { banner_text, popup_photo, popup_link, isActive } = req.body;

        const banner = await BannerService.createBanner(banner_text, popup_photo, popup_link, isActive);
        res.status(201).json({ banner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create banner' });
    }
};

exports.getBanner = async (req, res) => {
    try {
        const banner = await BannerService.getBanner();
        res.status(200).json({ banner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banner' });
    }
};


exports.updateBannerText = async (req, res) => {
    try {
        const { banner_text } = req.body;
        const updatedBanner = await BannerService.updateBannerText(req.params.id, banner_text);
        res.status(200).json({ banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update banner text' });
    }
};


exports.updatePopupPhoto = async (req, res) => {
    try {
        const { popup_photo } = req.body;
        const updatedBanner = await BannerService.updatePopupPhoto(req.params.id, popup_photo);

        res.status(200).json({ banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update popup photo' });
    }
};


exports.updatePopupLink = async (req, res) => {
    try {
        const { popup_link } = req.body;
        const updatedBanner = await BannerService.updatePopupLink(req.params.id, popup_link);
        res.status(200).json({ banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update popup link' });
    }
};


exports.updateIsActive = async (req, res) => {
    try {
        const { isActive } = req.body;
        const updatedBanner = await BannerService.updateIsActive(req.params.id, isActive);

        res.status(200).json({ banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update isActive' });
    }
};






