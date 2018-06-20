var mLevel = 0;
var availableKnife = [100];
var GameLevel = ( function () {

    function getLevel  () {
       return mLevel;
   }

   function getKnifeCount(){
       return (Math.random() * 5) + 5;
   }

  availableKnife[getLevel()] = getKnifeCount();

   function  updateLevel(){
     mLevel++
    localStorage.setItem(keyForCurrentLevel, mLevel);
    availableKnife[getLevel()] = getKnifeCount();

   }

  function  getAvailableKnife(){
      return availableKnife[getLevel()];
  }

   return {
       updateLevel       : updateLevel,
       getLevel          : getLevel,
       updateLevel       : updateLevel,
       getAvailableKnife : getAvailableKnife

   };

})();
