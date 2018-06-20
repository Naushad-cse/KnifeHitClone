
//Tags

var kTargetTag                                  =           1;
var kGameControllerLayerTag                     =           2;
var kKnifeTag                                   =           3;
var kBackGroundTag                              =           4;
var kDummyKnifeTag                              =           5;
var kAvailableKnifeInitialTag                   =           6;
var KDummyKnifeInitialTag                       =           17;
var kKnifeInitialTag                            =           28;
var kScoreLabelTag                              =           38;
var kScoreTag                                   =           39;
var KGameNameTag                                =           40;
var kGameOverLayerTag                           =           41;
var kRestartButtonTag                           =           42;
var kGameOverLabelTag                           =           43;
var kPlayButtonTag                              =           44;
var kSoundButtonTag                             =           45;
var kKnifeSelectorTag                           =           46;
var kHomeLayerTag                               =           47;
var kGameScoreLayerTag                          =           48;
var kLevelTag                                   =           49;
var kAppleCountTag                              =           50;
var kGameLayerTag                               =           51;
var kAppleTag                                   =           52;
var kknifeSelectionLayerTag                     =           53;
var kAvailableKnifeLayerTag                     =           54;
var kSoundSpriteTag                             =           55;
var kDummyBoardTag                              =           56;
var kGameNameKnifeTag                           =           57;
var kGameNameHitTag                             =           58;
var kPauseButtonTag                             =           59;
var kHomeButtonTag                              =           60;
var kReplayButtonTag                            =           61;
var kPauseLayerTag                              =           62;
var kGamePlayLayerTag                           =           63;
var kTargetLayerTag                             =           64;
var kKnifeLayerTag                              =           65;
var KSelectedKnifeTag                           =           66;
var kDummyBrokenBoardInitialTag                 =           67;
var kKnifeSelectionBackgroundTag                =           68;
var kKnifeSelectionInitialTag                   =           72;
var kSelectedButtonTag                          =           83;
var kCompanyNameTag                             =           84;
var kAttachedAppleTag                           =           85;
var kLeftCuttedAppleTag                         =           89;
var kRightCuttedAppleTag                        =           90;
var kAttachedKnifeTag                           =           91;
var kAppleCategory                              =           0x002;
var kKnifeCategory                              =           0x004;
var kTargetCategory                             =           0x008;
var kAppleMask                                  =           kKnifeCategory;
var kTargetMask                                 =           kKnifeCategory;
var kKnifeMask                                  =           kTargetCategory | kKnifeCategory  | kAppleCategory;
var kAttachedAppleCategory                      =           0x0016;
var kAttachedAppleMask                          =           -1;






//Next will start from 82.





//common
var kPTMRatio                                   =             32;

// KHGameControllerLayer
var KGravityInX                                 =             0;
var KGravityInY                                 =             0;

//--Knife
var KnifeWidth                                  =             15;
var KnifeLength                                 =             60;
var KnifeDensity                                =             7.85;
var KnifeRestitution                            =             0;
var KnifeFriction                               =             1.0;
var kTotalNumberOfKnife                         =             10;
var kKnifeImpulse                                =            20;

//--Target
var kTargetRadius                               =             60;
var KTargetDensity                              =             70000.85;
var KTargetRestitution                          =             0;
var KTargetFriction                             =             1.0;

//apple
var AppleRadius                                 =             15;
var AppleDensity                                =             0.00;
var AppleRestitution                            =             0.0;
var AppleFriction                               =             0.0;
var CuttedApplePositionMargin                   =             30;
var AppleImpulseInY                             =             15;
var AppleImpulseInX                             =             10;



//Score
var kScoreFontSize                              =              40;
//Game

var kGameFontSize                              =               50;
//GameOverLayerTag

var keyForCurrentLevel                         =               "currentLevel";
var keyForScore                                =               "currentScore";
var keyForAppleCount                           =               "appleCount";
var KeyForAppleText                            =               "apple";
var KeyForKnifeText                            =               "knife";
var KeyForAttachedKnifeText                    =               "attachedKnife";
var KeyForTargetText                           =               "target";
var KeyForLeftAppleText                        =               "leftApple";
var KeyForRightAppleText                       =               "rightApple";
var kCompanyName                               =               "CHICMIC";
var kDebugCanvas                               =                "debugCanvas";
var kDebugContext                              =                "2d";
