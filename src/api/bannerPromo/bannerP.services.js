const Banner = require('./bannerP.model');

const getBanner = async () => {
  try {
    const banner = await Banner.findOne();
    return banner;
  } catch (error) {
    throw new Error('Failed to fetch banner');
  }
};


module.exports = {
  getBanner
};
