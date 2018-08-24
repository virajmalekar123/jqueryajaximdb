$(document).ready(() => {
  $("#movieDetails").hide();
  // TODO
  $("#cardWithData").hide();

  $("#searchBtn").on("click", () => {
    fetchData();
  });
  $("#searchForm").on("submit", event => {
    fetchData();
    event.preventDefault();
  });
});
let defaultPhoto = "https://dummyimage.com/600x400/000/fff";

let fetchData = () => {
  let inputText = $("#searchText").val();
  console.log(inputText);

  if ($("#byName").prop("checked")) {
    if (inputText == " ") {
      alert("Please Enter Valid movie name");
      return;
    }
    inputMoviesByText(inputText);
  } else if ($("#byIMDBId").prop("checked")) {
    if (inputText == "") {
      alert("Pease Enter VALID IMBD ID");
      return;
    }
    getMoviesById(inputText);
  }
};

let  inputMoviesByText = validInputText=> {
  $.ajax({
    type: "GET",
    dataType: "json",
    async:true,  
    url: `https://www.omdbapi.com/?apikey=883b3010&t=${validInputText}`,
    success: feedback => {
      console.log(feedback);
      if (feedback.Response == "True") {
        $("#moviePoster").html(`
        <div id="moviePoster" class="col-sm-12 col-lg-4 col-xs-12 col-md-4 text-center animated sildeInLeft"></div><img src=${
          feedback.Poster
        } class="image"/>`);
        addValues(feedback);
        if (feedback.Poster == "N/A") {
          $("#moviePoster").html(`
          <div id="moviePoster" class="col-sm-12 col-lg-4 col-xs-12 col-md-4 text-center animated sildeInLeft"></div><img src=${defaultPhoto} class="image"/>`);
        }
      } else {
        alert("Nothing found in search results");
        $("#moviePoster").html(`
        <div id="moviePoster" class="col-sm-12 col-lg-4 col-xs-12 col-md-4 text-center animated sildeInLeft"></div><img src=${defaultPhoto} class="image"/>`);
      }
    },
    beforeSend: function() {
      refreshData();
      $("#cardWithData").show();
    },

    complete: function() {
      $("#movieDetails").show();
      $("#cardWithData").hide();
    },
    error: function(request, errorType, errorMessage) {
      $("#cardWithData").hide();
      console.log(request);
      console.log(errorType);
      alert("There is an error in connection");
    },

    timeout: 30000 // in ms
  });
};

//For IMBD ID

let getMoviesById = validInputId => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: `https://www.omdbapi.com/?apikey=883b3010&i=${validInputId}`,
    success: feedback => {
      if (feedback.Response == "True") {
        $("#moviePoster").html(`<img src=${feedback.Poster} class="image"/>`);
        addValues(feedback);
        if (feedback.Poster == "N/A") {
          $("#moviePoster").html(`<img src=${defaultPhoto} class="image"/>`);
        }
      } else {
        alert("Nothing Found in Search Results");
        $("#moviePoster").html(`<img src=${defaultPhoto} class="image"/>`);
      }
    },
    beforeSend: function() {
      refreshData();
      $("#cardWithData").show();
    },

    complete: function() {
      $("#movieDetails").show();
      $("#cardWithData").hide();
    },
    error: function(request, errorType, errorMessage) {
      $("#cardWithData").hide();
      console.log(request);
      console.log(errorType);

      alert("There is an error in connection");
    },

    timeout: 30000 // in ms
  });
};

let addValues = response => {
  $("#title").html(`<h3>${response.Title}</h3>`);

  $("#release").html(response.Released);

  $("#director").html(response.Director);

  $("#imdbRating").html(response.imdbRating);

  $("#imdbId").html(response.imdbID);

  $("#awards").html(response.Awards);

  defineElements(response.Actors, "actor");

  defineElements(response.Language, "language");

  defineElements(response.Genre, "genre");

  for (const iterator of response.Ratings) {
    if (iterator.Source == "Internet Movie Database") {
      console.log(iterator.Value);

      $("#imdb").html(iterator.Value);
    }
    if (iterator.Source == "Rotten Tomatoes") {
      $("#rottenTomatoes").html(iterator.Value);
    }
    if (iterator.Source == "Metacritic") {
      $("#metaCritic").html(iterator.Value);
    }
  }

  $("#Country").html(response.Country);

  $("#Runtime").html(response.Runtime);

  $("#Writer").html(response.Writer);

  $("#Metascore").html(response.Metascore);

  $("#Plot").html(response.Plot);

  $("#Rated").html(response.Rated);

  $("#Type").html(response.Type);

  $("#Year").html(response.Year);

  $("#imdbVotes").html(response.imdbVotes);
  if (response.totalSeasons) {
    $("#totalSeasons").html(response.totalSeasons);
  } else {
    $("#totalSeasons").html("N/A");
  }
};

let defineElements = (array, element) => {
  let listOfElements = "";
  for (const iterator of array) {
    listOfElements += iterator;
  }

  $(`#${element}`).html(listOfElements);
};

let refreshData = () => {
  $("#moviePoster").html('<img src="' + defaultPhoto + '" class="image"/>');

  $("#title").html("");

  $("#release").html("");

  $("#director").html("");

  $("#imdb").html("");

  $("#imdbId").html("");

  $("#awards").html("");

  $("#production").html("");
};
