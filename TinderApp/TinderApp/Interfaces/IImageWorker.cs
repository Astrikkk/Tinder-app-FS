namespace TinderApp.Interfaces
{
    public interface IImageWorker
    {
        /// <summary>
        /// Saves an image uploaded as an IFormFile and returns the generated filename.
        /// </summary>
        /// <param name="image">The uploaded image file.</param>
        /// <returns>The filename of the saved image.</returns>
        Task<string> SaveAsync(IFormFile image);

        /// <summary>
        /// Downloads and saves an image from a URL, returning the generated filename.
        /// </summary>
        /// <param name="urlImage">The URL of the image to save.</param>
        /// <returns>The filename of the saved image.</returns>
        Task<string> SaveAsync(string urlImage);

        /// <summary>
        /// Deletes all saved versions of an image by its filename.
        /// </summary>
        /// <param name="fileName">The filename of the image to delete.</param>
        /// <returns>True if deletion was successful; otherwise, false.</returns>
        bool Delete(string fileName);
    }
}
