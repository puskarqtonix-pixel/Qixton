# Qixton website

Static, responsive marketing website prepared for Netlify.

## Publish on Netlify

1. Sign in to Netlify.
2. Choose **Add new project** and then **Deploy manually**.
3. Drag the complete `qixton-site` folder or its ZIP file into Netlify Drop.
4. After deployment, open **Domain management** and connect the Qixton domain.
5. In **Forms**, enable email notifications for `site-audit` and `project-enquiry`.

The build command is intentionally empty and the publish directory is `.`. Netlify reads `netlify.toml` automatically.

## Before connecting a different domain

If the final domain is not `qixton.com`, update the two URLs in `sitemap.xml` and the sitemap URL in `robots.txt`.
