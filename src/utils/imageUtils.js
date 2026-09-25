export const getOptimizedImageUrl = (originalUrl) => {
  if (!originalUrl) return '';
  
  // Replace standard S3 URLs with CloudFront URL for faster CDN delivery
  // NOTE: CloudFront CDN rewrite is temporarily disabled because 
  // the distribution 'd138z56v0aevse.cloudfront.net' is not mapped to the product images bucket!
  // It causes images to break. DO NOT uncomment until AWS is fixed!
  
  /*
  const cloudfrontDomain = 'https://d138z56v0aevse.cloudfront.net';
  
  if (originalUrl.includes('amazonaws.com') && originalUrl.includes('.s3.')) {
    try {
      const urlObj = new URL(originalUrl);
      return `${cloudfrontDomain}${urlObj.pathname}`;
    } catch (e) {
      return originalUrl;
    }
  }
  */
  
  return originalUrl;
};
