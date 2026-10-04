interface PosterProps {
    src?: string;
    alt?: string;
}

export function Poster({ src, alt }: PosterProps) {
    return (
        <div className="w-48 h-72 rounded-lg overflow-hidden shadow-2xl border border-background-tertiary shrink-0">
            {src ? (
                <img
                    className="w-full h-full object-cover"
                    src={`https://image.tmdb.org/t/p/w300${src}`}
                    alt={alt}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-background-primary">
                    <img className="object-cover grayscale opacity-30" src="/logo_sad.png" alt={alt} />
                </div>
            )}
        </div>
    );
}
