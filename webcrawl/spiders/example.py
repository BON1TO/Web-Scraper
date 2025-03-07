import scrapy

class DynamicSpider(scrapy.Spider):
    name = "dynamic_spider"

    def __init__(self, url=None, *args, **kwargs):
        super(DynamicSpider, self).__init__(*args, **kwargs)
        if url:
            self.logger.info(f"🕵️‍♂️ Scraping URL: {url}")
            self.start_urls = [url]
        else:
            self.logger.warning("⚠️ No URL provided, using default.")
            self.start_urls = ["https://example.com"]

    def parse(self, response):
        title = response.xpath("//title/text()").get()
        h1 = response.xpath("//h1/text()").get()
        links = response.xpath("//a/@href").getall()[:5]  # Limit to 5 links

        scraped_data = {
            "title": title,
            "h1": h1,
            "links": links
        }

        if title or h1:
            self.logger.info(f"✅ Scraped Data: {scraped_data}")
        else:
            self.logger.warning("❌ No data found.")

        yield scraped_data
