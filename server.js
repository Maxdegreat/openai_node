const http = require('http');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/image-create') {
    try {
      const response = await openai.createImage({
        prompt: "(in a cartoon themed varsion, do not make this look realistic but like kid cartoons) A asian 5-8 fit man professor at a university teaching computer vision in a classoom of computer science students. who are paying attention to his teachings.",
        n: 2,
        size: "1024x1024",
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data.data[0].url));

      
    }  catch (e) {
      res.write(e);
      res.write(" ");
      res.write(res.statusCode);
      res.end(" ");
    }
  } else if (req.url === '/image-edit') {
    try {
      const response = await openai.createImageEdit(
        fs.createReadStream('./un_masked_image.png'),
        fs.createReadStream('./image_edit_mask.png'),
        "Please create an image edit of a cute baby sea otter wearing a beret. The image should have a resolution of 1024x1024 pixels and should be based on the provided mask image file",
        1,
        '1024x1024'
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data.data[0].url));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error performing image edit: ' + error);
    }
  } else if (req.url === '/image-variation') {
    try {
      const response = await openai.createImageVariation(
        fs.createReadStream("./dog_image_variation.png"),
        1,
        "1024x1024"
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data.data[0].url));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error performing image variation: ' + error);
    }
  } else if (req.url === '/') {
    res.write('type /image-edit to get url of an image variation');
    res.end('type /image-edit to get url of an image edit');
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});