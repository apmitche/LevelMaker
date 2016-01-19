package com.huskygamedesign.magnets;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.util.Log;
import com.huskygamedesign.magnets.R;
/**
 * Level loader that imports a file and creates a level using this text file.
 * 
 * @author Alicia
 *
 */
public class LevelLoader {

	Context _resources;

	/**
	 * Constructor for the level loader. 
	 * 
	 * @param r Entities
	 */
	public LevelLoader(Context r){
		_resources = r;
	}

	/**
	 * Loads a level from the passed file.
	 * 
	 * @param level A text file specifying where each entity is to be placed.
	 * @return The current level.
	 * @throws IOException If the file is not found.
	 */
	public Level loadLevel(String level){

		//Import Textures and Tilesheets
		Bitmap entities = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.entitytileset); // entity tilesheet
		Bitmap ballText = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.lighting); // ball texture
		Bitmap wallText = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.tileset); // wall tilesheet
		Bitmap directedText = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.magnettileset); // Directed magnets tilesheet
		Bitmap slider = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.sliderthing);
		Bitmap wallText2 = BitmapFactory.decodeResource(_resources.getResources(), R.drawable.tileset2); // New wall textures
				
		// Make Tilesheets
		Tilesheet entitySheet = new Tilesheet(entities, 50, 50);
		Tilesheet wallSheet = new Tilesheet(wallText, 50, 50);
		Tilesheet magnetSheet = new Tilesheet(entities, 100, 100);
		Tilesheet slide = new Tilesheet(slider, 5, 50);
		Tilesheet wallSheet2 = new Tilesheet(wallText2, 50, 50);
				
		//Individual Entities
		Bitmap sld = slide.getImageAt(0, 0);					// Slider
		Bitmap hole = entitySheet.getImageAt(3, 2);				// Game Over Hole
		Bitmap holeEntered = entitySheet.getImageAt(0,0);		// Game Over Hole Un-entered
		Bitmap victorySpace = entitySheet.getImageAt(2,2);		// Victory Hole
		Bitmap allMagnets = magnetSheet.getImageAt(1, 0);		// Top Right Magnets
		Bitmap triggerUnpressed = entitySheet.getImageAt(0,0);	// Triggers Unactivated
		Bitmap triggerPressed = entitySheet.getImageAt(1, 0);	// Trigger Activated
		// OLD WALLS
		Bitmap wallTopRightCorner = wallSheet.getImageAt(1, 0);	// Wall - Corner Top Right
		Bitmap wallTopLeftCorner = wallSheet.getImageAt(3, 0);	// Wall - Corner Top Left
		Bitmap wallBottomRightCorner = wallSheet.getImageAt(3, 2);// Wall - Corner Bottom Right
		Bitmap wallBottomLeftCorner = wallSheet.getImageAt(1, 2);// Wall - Corner Bottom Left
		
		Bitmap wallTop = wallSheet.getImageAt(2,0);			// Wall - Top
		Bitmap wallLeft = wallSheet.getImageAt(1,1);			// Wall - Left 
		Bitmap wallRight = wallSheet.getImageAt(3,1);			// Wall - Right
		Bitmap wallBottom = wallSheet.getImageAt(2,2);			// Wall - Bottom
		
		Bitmap wallBox = wallSheet.getImageAt(3, 3);			// Wall - Box
		
		// All 16 wall textures - NEW
		Bitmap wallTopLeftCorner2 = wallSheet2.getImageAt(1,0);    // Wall - Corner Top Left (1)
		Bitmap wallTopRightCorner2 = wallSheet2.getImageAt(3,0);   // Wall - Corner Top Right (3)
		Bitmap wallBottomLeftCorner2 = wallSheet2.getImageAt(1,2); // Wall - Corner Bottom Left (7)
		Bitmap wallBottomRightCorner2 = wallSheet2.getImageAt(3,2); // Wall - Corner Bottom Right (9)

		Bitmap wallTop2 = wallSheet2.getImageAt(2,0);				// Wall - Top Border (2)
		Bitmap wallLeft2 = wallSheet2.getImageAt(1,1); 				// Wall - Left Border (4)
		Bitmap wallRight2 = wallSheet2.getImageAt(3,1);				// Wall - Right Border (6)
		Bitmap wallBottom2 = wallSheet2.getImageAt(2,2);			// Wall - Bottom Border (8)

		Bitmap wallEndLeft = wallSheet2.getImageAt(0, 3);			// Wall - Enclosed End Left (14)
		Bitmap wallEndRight = wallSheet2.getImageAt(2, 3);			// Wall - Enclosed End Right (12)
		Bitmap wallEndTop = wallSheet2.getImageAt(0, 0);			// Wall - Enclosed End Top (13)
		Bitmap wallEndBottom = wallSheet2.getImageAt(0, 2);			// Wall - Enclosed End Bottom (15)
		Bitmap wallPipeVertical = wallSheet2.getImageAt(0, 1);		// Wall - Pipe Vertical | | (11)
		Bitmap wallPipeHorizontal = wallSheet2.getImageAt(1, 3);	// Wall - Pipe Horizontal (10)
		Bitmap foreverAlone = wallSheet2.getImageAt(3, 3);			// Wall - Enclosed Box on all Sides (16)
		Bitmap openEnded = wallSheet2.getImageAt(2, 1);				// Wall - Open on all sides. (5)
		
		// Import the level and load it
		Level currentLevel = new Level(level);
		
		try{

			InputStream in = _resources.getAssets().open(level);;
			Scanner s = new Scanner(in);

			// Place and add the floors and walls to the entity list FIRST before entities
			// This will add just walls, and where there are no walls, the space is skipped
			// so there is nothing there.
			char index;
			int idNUM = 0;		// Each line has an ID number associated with it.
			int line = 0;		// Line number.
			int xPos = 1;
			
			String mark = null;
			int levelWidth = 0;
			int levelLength = 0;
							
				if (s.hasNext()){
					mark = s.next();
				}

				if (s.hasNextInt()){
					levelWidth = s.nextInt();
					levelLength = s.nextInt();
				}

					// A capital D is the Dimensions of the level and it's background.
					// Will call setSize method: setSize( width, height )
					if (mark.equals("D")){
				
						currentLevel.setSize(levelWidth, levelLength);
						
						String folder = new String(level); // Duplicate the path
						int lastCharIndex = 0;
						for (int j = folder.length() - 1; j >= 0; j--) {
							if (folder.charAt(j) == '/') {
								lastCharIndex = j + 1;
								break;
							}
						}
						
						folder = folder.substring(0, lastCharIndex); // Cut of the filename
						
						String imageBG = s.next();
						InputStream path = _resources.getAssets().open(folder.concat(imageBG));
						
						Bitmap bgBitmap = BitmapFactory.decodeStream(path); // entity tilesheet
						currentLevel.setBackground(bgBitmap);
					}
				
								
			idNUM++;		// Increment ID number because the Dimensions are on the first line.		
			
			Point currentPoint = new Point(0,0);
			String str = s.nextLine();
			for(int i = 0; i < currentLevel.getHeight(); i++){
				str = str + s.nextLine();
			}
				// This loop moves over 50 pixels each time, since each entity we have is
				// 50 x 50 pixels.
				for (int i = 0; i < str.length() ; i++) {
					index = str.charAt(i);
					currentPoint.x = (int) ((i % currentLevel.getWidth())*50);
					currentPoint.y = ((int) (i / currentLevel.getWidth()) *50);
					
					
					// Place walls and floors 
					if(index == 'w'){

						// Search special cases first - these are the borders.
						
						// Place the Top Left corner
						if ((line == 0) && (xPos == 1)){
							// THIS IS A PLACE HOLDER TEXTURE FOR THE TOP LEFT CORNER
							Wall addWall = new Wall(currentPoint, foreverAlone, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos++;
							Log.v("Level loader", "Wall at 0,0 placed.");
						}
						
						// Place the Top Right corner
						else if ((line == 0) && (xPos == currentLevel.getWidth())){
							// THIS IS A PLACE HOLDER TEXTURE FOR THE TOP RIGHT CORNER
							Wall addWall = new Wall(currentPoint, foreverAlone, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos = 1;		// Reset x position - new line.
							idNUM++;		// Increment ID number
							line++;			// Increment line number
							Log.v("Level loader", "Wall at 0, maxwidth placed.");
						}
						
						// Place the walls at the top line.
						else if (line == 0){
							Wall addWall = new Wall(currentPoint, wallBottom2, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos++;
							Log.v("Level loader", "Wall at top line placed.");
						}
						
						// Place the wall at the bottom left corner.
						else if ((line == currentLevel.getHeight() - 1) && (xPos == 1)){
							// THIS IS A PLACE HOLDER TEXTURE FOR THE BOTTOM LEFT CORNER.
							Wall addWall = new Wall(currentPoint, foreverAlone, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos++;
							Log.v("Level loader", "Wall at bottom left corner placed.");
						}
						
						// Place the wall at the bottom right corner.
						else if ((line == currentLevel.getHeight() - 1) && (xPos == currentLevel.getWidth())){
							// THIS IS A PLACE HOLDER TEXTURE FOR THE BOTTOM RIGHT CORNER
							Wall addWall = new Wall(currentPoint, foreverAlone, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos = 1;		// Reset x position - new line.
							idNUM++;		// Increment ID number
							line++;			// Increment line number
							Log.v("Level loader", "Wall at bottom right corner placed.");
						}
						
						// Place the walls at the bottom line.
						else if (line == currentLevel.getHeight() - 1){							
							Wall addWall = new Wall(currentPoint, wallBottom2, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos++;
							Log.v("Level loader", "Wall at bottom line placed.");
						}
						
						// Place walls at xPos == 0 and xPos == width, or
						// vertical walls | |
						else if (xPos == 1){
							Wall addWall = new Wall(currentPoint, wallRight2, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos++;
							Log.v("Level loader", "Wall at 0,line# placed.");
						}
						
						else if (xPos == currentLevel.getWidth()){
							Wall addWall = new Wall(currentPoint, wallLeft2, true);
							addWall.id = idNUM;
							currentLevel.addEntity(addWall);
							xPos = 1;		// Reset x position - new line.
							idNUM++;		// Increment ID number
							line++;			// Increment line number
							Log.v("Level loader", "Wall at xPos,levelWidth placed. - Starting new line.");
						}



						else{

							/******************************************** 
							 * Process behind wall texture selection
							 * Order to Check: above, then before, then after, then below

							yes above
		  						yes before
		    						yes after	
		      							yes below
										- #16		      
		      							no below
		    							- #8
		    						no after
		      							yes below
		      							- #6
		      							no below      
										- #9
		  						no before
		    						yes after
		      							yes below 
		      							- #4
		      							no below
		    							- #7
		    						no after
		      							yes below
		     							- #11
		      							no below
										- #15

							no above
		  						yes before
		    						yes after
		      							yes below
										- #2	      
		      							no below
		    							- #10
		    						no after
		      							yes below
										- #3
		      							no below
										- #12
		  						no before
		    						yes after
		      							yes below
										- #1
		      							no below    
										- #14
		    						no after
		      							yes below
										- #13
		      							no below
										- #5
							 ****************************************/
							char search = str.charAt((int) (i - currentLevel.getWidth()));
							
							// yes above
							if (search == 'w'){

								search = str.charAt(i - 1);
								// yes before
								if (search == 'w'){

									search = str.charAt(i + 1);
									// yes after
									if (search == 'w'){

										search = str.charAt((int) (i + currentLevel.getWidth()));
										// yes below
										if (search == 'w'){
											// #16
											Wall addWall = new Wall(currentPoint, foreverAlone, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Wall open on all sides placed.");
										}

										// no below
										else{
											// #8
											Wall addWall = new Wall(currentPoint, wallBottom2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Bottom border wall placed.");
										}
									}

									// no after
									else{

										search = str.charAt((int) (i+currentLevel.getWidth()));
										// yes below
										if (search == 'w'){
											// #6
											Wall addWall = new Wall(currentPoint, wallRight2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Right wall placed.");
										}

										// no below
										else{
											// #9
											Wall addWall = new Wall(currentPoint, wallBottomRightCorner2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Bottom Right Corner placed.");
										}
									}
								}

								// no before
								else{

									search = str.charAt(i + 1);
									// yes after
									if (search == 'w'){

										search = str.charAt((int) (i + currentLevel.getWidth()));
										// yes below
										if (search == 'w'){
											// #4
											Wall addWall = new Wall(currentPoint, wallLeft2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Left wall placed.");
										}

										//no below
										else{
											// #7
											Wall addWall = new Wall(currentPoint, wallBottomLeftCorner2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Bottom left corner placed.");
										}
									}

									// no after 
									else{

										search = str.charAt((int) (i + currentLevel.getWidth()));
										// yes below
										if (search == 'w'){
											// #11
											Wall addWall = new Wall(currentPoint, wallPipeVertical, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Vertical pipe wall placed.");
										}

										// no below
										else{
											// #15
											Wall addWall = new Wall(currentPoint, wallEndBottom, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Wall end bottom placed.");
										}
									}

								}

							}

							// no above
							else {
								search = str.charAt(i + 1);

								// yes before
								if (search == 'w'){

									search = str.charAt(i - 1);
									// yes after
									if (search == 'w'){

										search = str.charAt((int) (i + currentLevel.getWidth()));

										// yes below
										if (search == 'w'){
											// #2
											Wall addWall = new Wall(currentPoint, wallTop2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Border on top wall placed.");
										}

										// no below
										else{
											// #10
											Wall addWall = new Wall(currentPoint, wallPipeHorizontal, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Horizontal pipe wall placed.");
										}
									}

									// no after
									else{

										search = str.charAt((int) (i + currentLevel.getWidth()));
										// yes below
										if (search == 'w'){
											// #3
											Wall addWall = new Wall(currentPoint, wallTopRightCorner2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Top right corner placed.");
										}

										// no below
										else{
											// #12
											Wall addWall = new Wall(currentPoint, wallEndRight, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Right end wall placed.");
										}
									}

								}

								// no before
								else{

									search = str.charAt(i + 1);
									// yes after
									if (search == 'w'){

										search = str.charAt((int) (i + currentLevel.getWidth()));
										// yes below
										if (search == 'w'){
											// #1
											Wall addWall = new Wall(currentPoint, wallTopLeftCorner2, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
										}

										else{
											// #14
											Wall addWall = new Wall(currentPoint, wallEndLeft, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "End Left wall placed..");
										}
									}

									// no after
									else{
										search = str.charAt((int) (i+currentLevel.getWidth()));

										// yes below
										if (search == 'w'){
											// #13
											Wall addWall = new Wall(currentPoint, wallEndTop, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "Wall end top placed.");
										}

										// no below
										else{
											// #5 
											Wall addWall = new Wall(currentPoint, foreverAlone, true);
											addWall.id = idNUM;
											currentLevel.addEntity(addWall);
											xPos++;
											Log.v("Level loader", "forever alone placed.");
										}
									}
								}
							}							
						}						
					}
					else if(index == 'o'){
						xPos++;
					}
					
				}
				

			
			
			// Place Entities Based on the Passed X and Y values
			idNUM+=2;			// Skip 2 lines because of the blank space after the wall assignments
			String entitymark = null;
			int placeX = 0;				// Desired X Value
			int placeY = 0;				// Desired Y Value
			int magStrength = 0;		// Desired magnet strength
			int magDirection = 0;		// Magnet direction for directional magnets
			int getEntityID = 0;		// Each entity will have an ID, this is used to get it

			// This loop executes until there are no more lines in the text file.
			while (true){
				
				// Get next marker
				if (s.hasNext()){
					entitymark = s.next();
				}
				
				// Get X and Y values - this can be used for many things, not just x and y values. For
				// example setting the width and height of the level.
				if (s.hasNextInt()){
					placeX = s.nextInt();
					placeY = s.nextInt();
				}
				
				// A capital D is the Dimensions of the level and it's background.
				// Will call setSize method: setSize( width, height )
				if (entitymark.equals("D")){
					currentLevel.setSize(placeX, placeY);
					
					String folder = new String(level); // Duplicate the path
					int lastCharIndex = 0;
					for (int i = folder.length() - 1; i >= 0; i--) {
						if (folder.charAt(i) == '/') {
							lastCharIndex = i + 1;
							break;
						}
					}
					
					folder = folder.substring(0, lastCharIndex); // Cut of the filename
					
					String imageBG = s.next();
					InputStream path = _resources.getAssets().open(folder.concat(imageBG));
					
					Bitmap bgBitmap = BitmapFactory.decodeStream(path); // entity tilesheet
					currentLevel.setBackground(bgBitmap);
				}
			
				// Check Entities and Place Entities
				
				// Place the ball
				if (entitymark.equals("b")){
					
					Point temp = new Point(placeX, placeY);
					Ball aBall = new Ball(temp, ballText);
					aBall.id = idNUM;
					currentLevel.addEntity(aBall);
				}
				
				// Place a hole
				if(entitymark.equals("h")){
					
					Point temp = new Point(placeX, placeY);
					Hole aHole = new Hole(temp, hole, holeEntered, true);
					aHole.id = idNUM;
					currentLevel.addEntity(aHole);
				}
				
				// Place the victory space
				if(entitymark.equals("v")){
					
					Point temp = new Point(placeX, placeY);
					VictorySpace aVictory = new VictorySpace(temp, victorySpace);
					aVictory.id = idNUM;
					currentLevel.addEntity(aVictory);
					// Debug: Log.v("Level loader", "Victory space placed.");
				}
				
				// Place the switchable on/off magnets
				if(entitymark.equals("s")){
					if (s.hasNextInt()){
						
						// Get magnet strength
						magStrength = s.nextInt();
					
						Point temp = new Point(placeX, placeY);
						Magnet aMagnet = new OnOffMagnets(temp, magStrength, allMagnets, null);
						aMagnet.id = idNUM;
						currentLevel.addEntity(aMagnet);
					}
				}
				
				// Place the always on magnet
				if(entitymark.equals("x")){
					if (s.hasNextInt()){
						
						// Get magnet strength
						magStrength = s.nextInt();
					
						Point temp = new Point(placeX, placeY);
						Magnet aMagnet = new OnlyOnMagnets(temp, magStrength, allMagnets, null);
						aMagnet.id = idNUM;
						currentLevel.addEntity(aMagnet);
					}
				}
				
				// Place the directional magnet
				if(entitymark.equals("d")){
					if (s.hasNextInt()){
						
						// Get magnet strength and then get the direction
						magStrength = s.nextInt();
						magDirection = s.nextInt();
					
						Point temp = new Point(placeX, placeY);
						Magnet aMagnet = new DirectedMagnets(temp, magStrength, directedText, null, magDirection);
						aMagnet.id = idNUM;
						currentLevel.addEntity(aMagnet);
					}
				}
				
				// Place the slider magnet
				if(entitymark.equals("l")){
					// Slider Format
					// l - that's a lower case "L"
					// x-coordinate
					// y-coordinate
					// width - note height should always be 50
					// height
					// if it is vertical ... 1 for true, 0 for false
					// magnet type (s,x,d)
					// magnet strength
					// direction - only used for directional magnets (0-3 for up, right, left, down)
					// i.e. l 300 300 50 200 1 s 7
					if (s.hasNextInt()){
						int width = s.nextInt();
						int height = s.nextInt();
						int vertical = s.nextInt();
						String magType = s.next();
						int strength = s.nextInt();
						
						Point temp = new Point(placeX, placeY);
						Slider aSldr = new Slider(temp, width, height, sld, vertical == 1 ? true : false);
						
						Magnet aMagnet = null;
						if (magType.equals("s")) {
							aMagnet = new OnOffMagnets(temp, strength, allMagnets, aSldr);
						} else if (magType.equals("x")) {
							aMagnet = new OnlyOnMagnets(temp, strength, allMagnets, aSldr);
						} else if (magType.equals("d")) {
							aMagnet = new DirectedMagnets(temp, strength, allMagnets, aSldr, s.nextInt());
						}
						
						aMagnet.id = idNUM;
						aSldr.id = 9001;
						currentLevel.addEntity(aMagnet);
						currentLevel.addEntity(aSldr);
					}
				}
				
				// Place a Triggerable Wall
				// This works by first creating a wall at the given X,Y coordinates
				// and then creating the trigger (the trigger is created on it's own line,
				// and the coordinates of the triggered entity will be passed). When the 
				// trigger is run over by the ball, this wall will switch on/off (disappear/reappear).
				if (entitymark.equals("w")){
					
					Point temp = new Point(placeX, placeY);
					Wall theWall = new Wall(temp, wallBox, true);
					theWall.id = idNUM;
					
					currentLevel.addEntity(theWall);
				}
				
				// Place a Trigger
				// A trigger can trigger any triggerable entity. First, you pass
				// the X, Y values of the actual trigger itself. Then an ID number
				// is passed. The ID Number is the ID number of the entity you want
				// triggered.
				if (entitymark.equals("t")){
					if(s.hasNextInt()){
						
						getEntityID = s.nextInt();
												
						Point temp = new Point(placeX, placeY);
						
						Log.v("Level Loader", "Trying to trigger " + getEntityID + " placing at (" + placeX + "," + placeY + ")");
						
						// This will go through the ID Numbers and search for the ID of the entity you want to trigger.
						for(Entity e : currentLevel.getEntities()){
							if(e.id == getEntityID){
								Trigger t = new Trigger(temp, triggerPressed, triggerUnpressed, (TriggerableEntity) e);
								currentLevel.addEntity(t);
								Log.v("LevelLoader", "Trigger placed.");
								break;
							}
						}
						
					}
				}
				
				if (!s.hasNextLine())
					break;
				
				idNUM++;
			}
			
			

		} catch (IOException error){
			error.printStackTrace();
			return null;
		}
		
		return currentLevel;
	}
}
