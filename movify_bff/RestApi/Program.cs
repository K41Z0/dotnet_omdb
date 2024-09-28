using Domain.Repositories.MovieRepository;
using Infrastructure.DataSources;
using Infrastructure.Interfaces;
using Infrastructure.Repositories;
using RestApi.Exceptions.Handlers;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<IHttpDataSource, OmDbDataSource>(client =>
{
    client.BaseAddress = new Uri("http://www.omdbapi.com/");
});
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.IncludeFields = false;
});
builder.Services.AddScoped<IMovieRepository, MovieRepository>();
builder.Services.AddControllers();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddPolicy("OriginPolicy", corsPolicyBuilder =>
    {
        corsPolicyBuilder.SetIsOriginAllowed(origin =>
            {
                var host = new Uri(origin).Host;
                var isLocalhost = host.Equals("localhost", StringComparison.OrdinalIgnoreCase);
                return isLocalhost;
            })
            .AllowAnyHeader()
            .WithMethods("GET");
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => { options.SwaggerEndpoint("/swagger/v1/swagger.json", "Moviefy BFF v1"); });
}

app.UseCors("OriginPolicy");
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();