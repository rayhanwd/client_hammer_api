const Banner = require('./bannerP.model');

const createBanner = async (banner_text, popup_photo, popup_link, isActive) => {
  try {
    const banner = await Banner.create({ banner_text, popup_photo, popup_link, isActive });
    return banner;
  } catch (error) {
    throw new Error('Failed to create banner');
  }
};

const getBanner = async () => {
  try {
    const banner = await Banner.findOne();
    return banner;
  } catch (error) {
    throw new Error('Failed to fetch banner');
  }
};
// Services
const updateBannerText = async (bannerId, bannerText) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { banner_text: bannerText },
      { new: true }
    );
    return updatedBanner;
  } catch (error) {
    throw new Error('Failed to update banner text');
  }
};

const updatePopupPhoto = async (bannerId, popup_photo) => {

  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { popup_photo: popup_photo },
      { new: true }
    );
    return updatedBanner;
  } catch (error) {
    throw new Error('Failed to update popup photo');
  }
};

const updatePopupLink = async (bannerId, popup_link) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { popup_link: popup_link },
      { new: true }
    );
    return updatedBanner;
  } catch (error) {
    throw new Error('Failed to update popup link');
  }
};


const updateIsActive = async (bannerId, isActive) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      { isActive },
      { new: true }
    );
    return updatedBanner;
  } catch (error) {
    throw new Error('Failed to update isActive');
  }
};


module.exports = {
  createBanner,
  getBanner,
  updateBannerText,
  updatePopupPhoto,
  updatePopupLink,
  updateIsActive
};
