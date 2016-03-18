
$(document).ready(function(){
  console.log('inside doc reay!');
  $('#animals-form').on('submit', postAnimals);
  getAnimals();


});

function postAnimals(event){
  event.preventDefault();

  console.log('made it into postAnimals function');

  var formData = {};
  console.log('form data', formData);

  var formArray = $('#animals-form').serializeArray();
  $.each(formArray, function(index, element){
    formData[element.name] = element.value;
  });
  console.log('form data', formData);

  $.ajax({
    type:'POST',
    url: '/animals',
    data: formData,
    success: getAnimals
  });
  $('#animals-form').trigger('reset');

}
function getAnimals() {
  $.ajax({
    type: 'GET',
    url: '/animals',
    success: animalsAppendDom
  });
}
function animalsAppendDom(animalsArray){
  $('.all-animals').empty();
  console.log('inside appendDom after GET call', animalsArray);
  for(var i = 0; i < animalsArray.length; i++){
  $('.all-animals').append('<p>'+animalsArray[i].name+' did you day? We have '+animalsArray[i].quantity+' of those!</p>')
  }
}
