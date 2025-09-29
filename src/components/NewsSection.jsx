import React, { useEffect, useState } from "react";

const NewsSection = () => {
    const [articles, setArticles] = useState([]);
    const apiKey = "41a78c4a581c487fa21ecea57d785e82";
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);
    const fromISO = fromDate.toISOString().split("T")[0];

    const q = encodeURIComponent(
        `"natural disaster" AND India OR earthquake OR flood`
    );
    const url = `https://newsapi.org/v2/everything?q=${q}&from=${fromISO}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setArticles(data.articles.slice(0, 6));
            })
            .catch((error) => console.error("Error fetching news:", error));
    }, []);

    return (
        <div className="flex flex-col justify-center my-10 px-4">
            <h1 className="text-4xl font-bold py-10 text-gray-800">Latest Disaster News</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <div
                        key={index}
                        className="bg-indigo-400 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <img
                                src={article.urlToImage || "default.jpg"}
                                alt="News"
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-700 text-lg">{article.title}</h3>
                                <p className="text-sm text-gray-200 mt-2">
                                    {article.description?.slice(0, 100)}...
                                </p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsSection;