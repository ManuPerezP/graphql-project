const graphql = require('graphql');
var _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');



//dummy data
// var usersData = [
//      {id: '1', name: 'Bond', age: 36, profession: 'Programmer'},
//      {id: '13', name: 'Anna', age: 26, profession: 'Baker'},
//      {id: '211', name: 'Bella', age: 16, profession: 'Mechanic'},
//      {id: '19', name: 'Gina', age: 26, profession: 'Painter'},
//      {id: '150', name: 'Georgina', age: 36, profession: 'Teacher'}
// ];

// var hobbiesData = [
//     {id: '1', title: 'Programming', description: 'Using computers to make the world a better place', userId: '150'},
//     {id: '2', title: 'Rowing', description: 'Sweat and feel better before eating donouts', userId: '211'},
//     {id: '3', title: 'Swimming', description: 'Get in the water and learn to become the water', userId: '211'},
//     {id: '4', title: 'Fencing', description: 'A hobby for fency people', userId: '13'},
//     {id: '5', title: 'Hiking', description: 'Wear hiking boots and explore the world', userId: '150'},
// ];

// var postsData = [
//     {id: '1', comment: 'Building a Mind', userId: '1'},
//     {id: '2', comment: 'GraphQL is Amazing', userId: '1'},
//     {id: '3', comment: 'How to Change the World', userId: '19'},
//     {id: '4', comment: 'How to Change the World', userId: '211'},
//     {id: '5', comment: 'How to Change the World', userId: '1'}
// ]



 const {
     GraphQLObjectType,
     GraphQLID,
     GraphQLString,
     GraphQLInt,
     GraphQLSchema,
     GraphQLList,
     GraphQLNonNull

 } = graphql


//Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
          id: {type: GraphQLID},
          name: {type: GraphQLString},
          age: {type: GraphQLInt},
          profession: {type: GraphQLString},

          posts: {
               type: new GraphQLList(PostType),
               resolve(parent, args) {
                    
                    return Post.find({userId: parent.id});
               }
          },

          hobbies : {
              type: new GraphQLList(HobbyType),
              resolve(parent, args) {

                  return Hobby.find({userId: parent.id});
                   
              }
          }
          


    })

});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                 return User.findById(parent.userId);
            }
        }
       
    })
});

//Post type (id, comment)
const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
         id: {type: GraphQLID},
         comment: {type: GraphQLString},
         user: {
              type: UserType,
              resolve(parent, args) {
            
                return User.findById(parent.userId);
            
                   
              }
         }
        
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
         user: {
              type: UserType,
              args: {id: {type: GraphQLString}},

              resolve(parent, args) {
                        
                       return User.findById(args.id);

                    }
         },

         users: {
             type: new GraphQLList(UserType),
             resolve(parent, args){
                
                 
                return User.find({});
                
             }

         },

         hobby: {
               type: HobbyType,
               args: {id: {type: GraphQLID}},

               resolve(parent, args) {
                    //return data for our hobby
                    
                    return Hobby.findById(args.id);

               }
         },

         hobbies: {
             type: new GraphQLList(HobbyType),
             //args: {id: {type: GraphQLID}},
             resolve(parent, args) {
                //console.log(args.id)
                console.log("Hello World Hobbies!" + parent.userId);
            
                //  return Hobby.find({id: args.userId});
                return Hobby.find({id: args.userId});
                 
                  
             }
         },
        

         post: {
              type: PostType,
              args: {id: {type: GraphQLID}},

              resolve(parent, args) {
                   //return data (post data)

                   return Post.findById(args.id);
                   
              }
         },

         posts: {
              type: new GraphQLList(PostType),
              resolve(parent, args){

                return Post.find({});

            
              }
         }


         
         
    }
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
       CreateUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },

            resolve(parent, args) {
                let user = new User( {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                //save to our db
                return user.save();


            }

       },

       //Update User
       UpdateUser: {
           type: UserType,
           args: {
            id: {type: new GraphQLNonNull(GraphQLString)},
            name: {type: new GraphQLNonNull(GraphQLString)},
            age: {type: GraphQLInt},
            profession: {type: GraphQLString}
    
           },
           resolve(parent, args) {
                
            return updatedUser = User.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        name: args.name,
                        age: args.age,
                        profession: args.profession
                    }
                },
                {new: true} //send back the updated objectType
            )

           }
       },

       //Remove User
       RemoveUser: {
            type: UserType,
            args: {
                 id: {type: new GraphQLNonNull(GraphQLString)}

            },
            resolve(parent, args) {
                 let removedUser = User.findByIdAndRemove(
                     args.id
                 ).exec();

                 if(!removedUser){
                     throw new("Error");
                 }

                 return removedUser;
            }
       },

       //todo: CreatePost mutation
       CreatePost: {
           type: PostType,
           args: {
        
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
           },

           resolve(parent, args) {
            let post = new Post({
                comment: args.comment,
                userId: args.userId
            });

            return post.save();
        

           }
       },

       //Update Post
       UpdatePost: {
        type: PostType,
        args: {
             id: {type: new GraphQLNonNull(GraphQLString)},
             comment: {type: new GraphQLNonNull(GraphQLString)},
            // userId: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve(parent, args) {
            return updatedPost = Post.findByIdAndUpdate(
                args.id,
                {
                    $set : {
                        comment: args.comment,
                    
                    }
                },
                {new: true}
                 
            )
        }
            
       },

      //Remove a Post
      RemovePost: {
          type: PostType,
          args: {
             id: {type: new GraphQLNonNull(GraphQLString)}
          },

          resolve(parent, args) {

            let removedPost= Post.findByIdAndRemove(
                args.id
            ).exec();

            if(!removedPost){
                throw new("Error");
            }

            return removedPost;
              
               
          }
      },

       //todo: CreateHobby mutation
       CreateHobby: {
            type: HobbyType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                 let hobby = new Hobby({
                      title: args.title,
                      description: args.description,
                      userId: args.userId
                 });

                 return hobby.save();

            }
       },

        //Update Hobby
  UpdateHobby: {
    type: HobbyType,
    args: {
      id: {type: new GraphQLNonNull(GraphQLString)},
      title: {type: new GraphQLNonNull(GraphQLString)},
      description: {type: new GraphQLNonNull(GraphQLString)}
      //userId: { type: new GraphQLNonNull(GraphQLString)}

    },

    resolve(parent, args) {
        return updatedHobby = Hobby.findByIdAndUpdate(
            args.id,
            {
                $set: {
                      title: args.title,
                      description: args.description
                }
            },
            {new: true})
    }
},

 //Remove a Hobby
 RemoveHobby: {
    type: HobbyType,
    args: {
       id: {type: new GraphQLNonNull(GraphQLString)}
    },

    resolve(parent, args) {

      let removedHobby = Hobby.findByIdAndRemove(
          args.id
      ).exec();

      if(!removedHobby){
          throw new("Error");
      }

      return removedHobby;
        
         
    }
},
  },//End of the fields

 

});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})





