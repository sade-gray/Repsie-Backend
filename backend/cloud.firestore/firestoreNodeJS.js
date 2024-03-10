var {Firestore} = require('@google-cloud/firestore')
const {Storage} = require('@google-cloud/storage')
const firebase = require("firebase/app")
const admin = require('firebase-admin')
const serviceAccount = require('./repsie-firebase-adminsdk-dkuz6-fd3cdd508f.json')
const bcrypt = require('bcrypt')
const uuid = require('uuid-v4');

let firestore
async function authenticateImplicitWithAdc() {
    firestore = new Firestore({"projectId":"repsie"})
}

authenticateImplicitWithAdc()

const storage = new Storage({
    projectId:"repsie",
    keyFilename: serviceAccount
})

const firebaseConfig = {
    apiKey: "AIzaSyAJrXQY66JuycdEIOk3h_lXunPSNrVW50Y",
    authDomain: "repsie.firebaseapp.com",
    projectId: "repsie",
    storageBucket: "repsie.appspot.com",
    messagingSenderId: "741936558270",
    appId: "1:741936558270:web:f95d3641f3db2223522eef"
}

firebase.initializeApp(firebaseConfig)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})


// https://googleapis.dev/nodejs/firestore/latest/Firestore.html
// https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#collection
// https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

let message = ""

const recipeCollRefs = firestore.collection('recipes');


/**
 * Returns an array of all the recipes ever created.
 * There is no specific order in which they are listed
 * @returns {Promise<*>}
 */

// Issue: Need to deal with cases where the user's likes, or savedRecipes is an empty collection - causes an error

// const isSaved = !userSaved ? null : userSaved.some((savedDoc) => savedDoc.id === doc.id)
//const isLiked = !userLiked ? null : userLiked.some((likedDoc) => likedDoc.id === doc.id)

  const getRecipes = async () => {
    const snapshot = await recipeCollRefs.get()
  
    if (snapshot.empty) return
  
    return snapshot.docs.map((doc) => {
      const recipeData = doc.data()

      return {
        id: doc.id,
        title: recipeData.title,
        timeRating: recipeData.timeRating,
        skillRating: recipeData.skillRating,
        userId: recipeData.userId,
      }
    })
  }

  const getRecipe = async (uid) => {
    let document = await firestore.doc(`recipes/${uid}`).get()
    const recipe = document.data()
    return recipe
  }
  
// Need to check if this works 
//
const getUserRecipes = async (user) => {
    try {
        const snapshot = await firestore.collection(`users/${user}/createdRecipes`).get();

        if (snapshot.empty) return [];

        const createdRecipes = [];
        snapshot.forEach(doc => {
            createdRecipes.push(doc.id);
        });

        const filtered = createdRecipes.filter(docId => docId !== 'default');

        const fullCol = await getRecipes(); 

        const userRecipes = filtered.map(docId => fullCol.find(data => data.id === docId));

        return userRecipes;
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        return [];
    }
};


/**
 * Creates a new recipe in the database
 * @param data TODO - specify what input data it is
 * @returns {Promise<void>} The document created or nothing
 */
const postRecipe = async (data, uid) => {
    try {
      const collRef = await firestore.collection(`users/${uid}/createdRecipes`)

      data.userId = uid
  
      const postDocRef = await recipeCollRefs.add(data);
    
      await collRef.doc(postDocRef.id).set({exists: true})

      await firestore.collection(`recipes/${postDocRef.id}/comments`)
            .doc("default")
            .set({default: "default"})

      await firestore.collection(`recipes/${postDocRef.id}/likes`)
            .doc("default")
            .set({default: "default"})
  
      return postDocRef.id;
    } catch (error) {
      return 
    }
  };


const updatingRecipe = async (id, data) => {
    let document = firestore.doc(`recipes/${id}`)
    await document.update(data).then(() => {
        return true
    }).catch(() => {
        return 
    })
}

const deletingRecipe = async (id) => {
    let document = firestore.doc(`recipes/${id}`)
    document.delete()
        .then(() => {
            return true
        })
        .catch(() => {
            return 
        })
}


const emailSignUp = async (email, password) => {
    try {
        await admin.auth().createUser({
            email: email,
            password:password,
            emailVerified: false,
            disabled: false
        })
        const uid = await getUID(email)

        await firestore.collection(`users/${uid}/savedRecipes`)
            .doc("default")
            .set({default: "default"})

        await firestore.collection(`users/${uid}/createdRecipes`)
            .doc("default")
            .set({default: "default"})

        await firestore.collection(`users/${uid}/likes`)
            .doc("default")
            .set({default: "default"})
        
        return true
    } catch (err) {
        console.log(err)
        return
    }
};


const emailUserUpdate = async (uid, updatedData) => {
    await admin.auth().updateUser(uid, {
        email: updatedData.email,
        password: updatedData.password
    })
    .then(userRecord => {
        console.log(userRecord)
        return true
    })
    .catch(() => {
        return 
    })
}

const tokenGen = async (email) => {
    try {
        const uid = await getUID(email);
        if (uid !== undefined) {
            const customToken = await admin.auth().createCustomToken(uid);
            return customToken;
        }
    } catch (err) {
        return
    }
}

/**
 *
 * Issue : need to find a way to compare the password provided with the password that is in the database
 */

const verifyCredentials = async (email, password) => {
admin.auth().getUserByEmail(email)
.then((userRecord) => {
    const storedHashedPassword = userRecord.password;
    console.log(storedHashedPassword)

    if (storedHashedPassword == password) {
        console.log('Passwords match!')
    } else {
        console.log('Passwords do not match.');
    }
})
.catch((error) => {
    console.error('Error fetching user data:', error);
})
}


const getUID = async (email) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        return userRecord.uid;
    } catch (error) {
        return
    }
}

const getSaved = async (user) => {
    try {
        const snapshot = await firestore.collection(`users/${user}/savedRecipes`).get();

        if (snapshot.empty) return [];

        const createdRecipes = [];
        snapshot.forEach(doc => {
            createdRecipes.push(doc.id);
        });

        const filtered = createdRecipes.filter(docId => docId !== 'default');

        const fullCol = await getRecipes(); 

        const userRecipes = filtered.map(docId => {
            const data = fullCol.find(item => item.id === docId);
            if (data) {
                return {
                    id: docId,
                    title: data.title,
                    timeRating: data.timeRating,
                    skillRating: data.skillRating,
                    userId: data.userId,
                };
            }
            return []; 
        });
        return userRecipes;
    } catch (error) {
        return []; 
    }
};


const newSave = async (post, user) => {
    try {
        await firestore.collection(`users/${user}/savedRecipes`)
            .doc(post)
            .set({exists:true})
        return true
    }

    catch (error) {
        return
    }
}

const deleteSave = async (post, user) => {
    try {
        await firestore.collection(`users/${user}/savedRecipes`)
            .doc(post)
            .delete()
        return true
    } 
    catch (error) {
        return
    }
}

const like = async (post, user) => {
    try {
        await firestore.collection(`recipes/${post}/likes`)
            .doc(user)
            .set({ id: user })
        return true
    } catch (error) {
        return false
    }
}

const unlike = async (post, user) => {
    try {
        await firestore.collection(`recipes/${post}/likes`)
            .doc(user)
            .delete()
        return true
    } catch (error) {
        return false
    }
};
const getLikes = async (user) => {
    try {
        const snapshot = await firestore.collection(`users/${user}/likes`).get();

        if (snapshot.empty) {
            return [];
        }

        const filtered = snapshot.docs.filter(doc => doc.id !== 'default');

        return filtered.map(doc => doc.id);
    } catch (error) {
        return [];
    }
};


const countLikes = async (post) => {
    try {
        const likesSnapshot = await firestore.collection(`recipes/${post}/likes`).get();
        const likesCount = likesSnapshot.size; // Use .size instead of .length
        return likesCount || 0; // Simplified conditional expression
    } catch (error) {
        return 0;
    }
};


const allComments = async (post) => {
    try {
        const commentsSnapshot = await firestore.collection(`recipes/${post}/comments`).get();
        if (commentsSnapshot.empty) {
            return []; // Return an empty array if no comments found
        }

        const filtered = commentsSnapshot.docs.filter(doc => doc.id !== "default");

        return filtered.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching comments:", error); // Log the error
        throw new Error("Unable to retrieve comments"); // Throw a custom error
    }
};


const postComment = async (post, comment) => {
    try {
        const docRef = await firestore.collection(`recipes/${post}/comments`)
        await docRef.add(comment)
        return true
    } catch (error) {
        return false
    }
}

const deleteComment = async (commentId, post) => {
    try {
        await firestore.collection(`recipes/${post}/comments`).doc(commentId).delete()
        return true
    } catch (error) {
        return false
    }
}

const upload = async (fileContent) => {
    try {   

    }
    catch (error) {
        return
    }
}

module.exports = {
    emailSignUp,
    verifyCredentials,
    getRecipes,
    postRecipe,
    updatingRecipe,
    deletingRecipe,
    deleteSave,
    message,
    firebase,
    emailUserUpdate,
    tokenGen,
    newSave,
    getUID,
    getSaved,
    getUserRecipes,
    like, 
    unlike,
    countLikes, 
    getLikes, 
    allComments, 
    postComment, 
    deleteComment, 
    upload,
    getRecipe
}
