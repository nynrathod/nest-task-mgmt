function CardLoader() {
  return (
    <div className="relative rounded-lg group">
      <div
        className={`bg-gray-800 animate-pulse relative p-4 block shadow-lg justify-between items-center transition-all duration-300`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 rounded-full bg-gray-600 animate-pulse"></div>
          <div className="flex justify-between w-full">
            <div>
              <div className="bg-gray-600 w-[300px] rounded-lg animate-pulse h-6" />
              <div>
                <div className=" mt-2">
                  <div className="h-4 w-28 rounded-lg bg-gray-600 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full animate-pulse bg-gray-600 " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardLoader;
