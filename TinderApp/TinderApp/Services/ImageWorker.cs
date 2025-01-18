using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using TinderApp.Interfaces;

namespace TinderApp.Services
{
    public class ImageWorker : IImageWorker
    {
        private readonly IConfiguration _configuration;

        public ImageWorker(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool Delete(string fileName)
        {
            try
            {
                var directory = _configuration["ImageFolder"];
                var sizes = _configuration["ImageSizes"].Split(",")
                    .Select(int.Parse);

                foreach (var size in sizes)
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), directory, $"{size}_{fileName}");
                    if (File.Exists(filePath))
                        File.Delete(filePath);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> SaveAsync(IFormFile image)
        {
            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            return SaveByteArray(memoryStream.ToArray());
        }

        public async Task<string> SaveAsync(string url)
        {
            try
            {
                using var client = new HttpClient();
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    throw new Exception("Failed to download the image.");

                var imageBytes = await response.Content.ReadAsByteArrayAsync();
                return SaveByteArray(imageBytes);
            }
            catch
            {
                return string.Empty;
            }
        }

        private string SaveByteArray(byte[] bytes)
        {
            var imageName = $"{Guid.NewGuid()}.webp"; // Генерація нового унікального імені файлу
            var directory = _configuration["ImageFolder"];
            var sizes = _configuration["ImageSizes"].Split(",").Select(int.Parse);

            // Створення різних розмірів зображень
            Parallel.ForEach(sizes, size =>
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), directory, $"{size}_{imageName}");
                using var image = Image.Load(bytes);
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(size),
                    Mode = ResizeMode.Max
                }));
                image.Save(filePath, new WebpEncoder());
            });

            // Повертаємо шлях до зображення як /images/{imageName}.webp
            return $"/images/{imageName}";
        }

    }
}
